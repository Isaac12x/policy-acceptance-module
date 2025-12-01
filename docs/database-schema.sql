-- ============================================================================
-- Policy Acceptance Module - Database Schema
-- ============================================================================
-- This schema supports individual, company-wide, and hybrid policy acceptance
-- workflows with comprehensive audit logging and version management.
-- ============================================================================

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Stores user information and permissions
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin', 'legal', 'company-admin')),
    company_id VARCHAR(255),
    can_accept_for_company BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_company_id (company_id),
    INDEX idx_role (role)
);

-- ============================================================================
-- COMPANIES TABLE
-- ============================================================================
-- Stores company/organization information
CREATE TABLE companies (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    requires_company_acceptance BOOLEAN DEFAULT FALSE,
    allow_individual_acceptance BOOLEAN DEFAULT TRUE,
    require_authority_confirmation BOOLEAN DEFAULT TRUE,
    require_title_and_email BOOLEAN DEFAULT TRUE,
    allow_delegated_acceptance BOOLEAN DEFAULT FALSE,
    notification_emails TEXT, -- JSON array of emails
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_domain (domain),
    INDEX idx_name (name)
);

-- ============================================================================
-- COMPANY_ADMINS TABLE
-- ============================================================================
-- Maps which users can accept policies on behalf of their company
CREATE TABLE company_admins (
    id VARCHAR(255) PRIMARY KEY,
    company_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    granted_by VARCHAR(255),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_user (company_id, user_id),
    INDEX idx_user_id (user_id)
);

-- ============================================================================
-- POLICIES TABLE
-- ============================================================================
-- Stores policy metadata and configuration
CREATE TABLE policies (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('terms', 'privacy', 'cookies', 'data-processing', 'security', 'custom')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    current_version VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    requires_acceptance BOOLEAN DEFAULT TRUE,
    allow_version_rollback BOOLEAN DEFAULT FALSE,
    retention_period_days INT DEFAULT 2555, -- ~7 years
    send_reminders BOOLEAN DEFAULT TRUE,
    reminder_days TEXT, -- JSON array of days [7, 3, 1]
    escalation_emails TEXT, -- JSON array of emails
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_is_active (is_active),
    INDEX idx_current_version (current_version)
);

-- ============================================================================
-- POLICY_VERSIONS TABLE
-- ============================================================================
-- Stores all versions of each policy with full content
CREATE TABLE policy_versions (
    id VARCHAR(255) PRIMARY KEY,
    policy_id VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    changes TEXT, -- JSON array of change descriptions
    is_breaking BOOLEAN DEFAULT FALSE,
    deadline TIMESTAMP,
    grace_period_days INT DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    word_count INT,
    reading_time_minutes INT,
    language VARCHAR(10) DEFAULT 'en',
    jurisdiction VARCHAR(100),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    
    FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    UNIQUE KEY unique_policy_version (policy_id, version),
    INDEX idx_policy_id (policy_id),
    INDEX idx_version (version),
    INDEX idx_deadline (deadline),
    INDEX idx_is_active (is_active)
);

-- ============================================================================
-- POLICY_ACCEPTANCES TABLE
-- ============================================================================
-- Tracks individual policy acceptances with full audit trail
CREATE TABLE policy_acceptances (
    id VARCHAR(255) PRIMARY KEY,
    policy_id VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acceptance_type VARCHAR(50) NOT NULL CHECK (acceptance_type IN ('individual', 'company')),
    
    -- Company acceptance details (when acceptance_type = 'company')
    company_name VARCHAR(255),
    acceptor_name VARCHAR(255),
    acceptor_title VARCHAR(255),
    acceptor_email VARCHAR(255),
    acceptor_user_id VARCHAR(255),
    signature_method VARCHAR(50) CHECK (signature_method IN ('click', 'typed', 'digital')),
    
    -- Audit information
    ip_address VARCHAR(45), -- IPv6 compatible
    location VARCHAR(255),
    user_agent TEXT,
    session_id VARCHAR(255),
    device_type VARCHAR(50),
    browser_info TEXT,
    
    -- Validity and revocation
    is_valid BOOLEAN DEFAULT TRUE,
    revoked_at TIMESTAMP,
    revoked_by VARCHAR(255),
    revoked_reason TEXT,
    
    FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (acceptor_user_id) REFERENCES users(id),
    FOREIGN KEY (revoked_by) REFERENCES users(id),
    
    INDEX idx_policy_user (policy_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_accepted_at (accepted_at),
    INDEX idx_acceptance_type (acceptance_type),
    INDEX idx_is_valid (is_valid),
    INDEX idx_version (version)
);

-- ============================================================================
-- ORGANIZATION_SETTINGS TABLE
-- ============================================================================
-- Stores organization-level policy acceptance configuration
CREATE TABLE organization_settings (
    id VARCHAR(255) PRIMARY KEY,
    company_id VARCHAR(255) UNIQUE,
    
    -- Company acceptance requirements
    require_company_acceptance BOOLEAN DEFAULT FALSE,
    allow_individual_acceptance BOOLEAN DEFAULT TRUE,
    require_authority_confirmation BOOLEAN DEFAULT TRUE,
    
    -- User permissions
    who_can_accept_for_company VARCHAR(50) DEFAULT 'admins-only' 
        CHECK (who_can_accept_for_company IN ('admins-only', 'designated-users', 'any-user')),
    require_manager_approval BOOLEAN DEFAULT FALSE,
    
    -- Acceptance behavior
    acceptance_scope VARCHAR(50) DEFAULT 'individual' 
        CHECK (acceptance_scope IN ('individual', 'company-wide', 'both')),
    new_users_inherit_company_acceptance BOOLEAN DEFAULT TRUE,
    company_acceptance_overrides_individual BOOLEAN DEFAULT FALSE,
    
    -- Notifications
    notifications_enabled BOOLEAN DEFAULT TRUE,
    reminder_days TEXT, -- JSON array [30, 14, 7, 3, 1]
    escalation_chain TEXT, -- JSON array of user IDs
    send_to_managers BOOLEAN DEFAULT TRUE,
    
    -- Compliance and audit
    log_all_actions BOOLEAN DEFAULT TRUE,
    require_digital_signature BOOLEAN DEFAULT FALSE,
    retention_period_years INT DEFAULT 7,
    export_format VARCHAR(10) DEFAULT 'json' CHECK (export_format IN ('json', 'csv', 'pdf')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- ============================================================================
-- POLICY_AUDIT_LOG TABLE
-- ============================================================================
-- Comprehensive audit trail of all policy-related actions
CREATE TABLE policy_audit_log (
    id VARCHAR(255) PRIMARY KEY,
    action_type VARCHAR(100) NOT NULL, -- 'view', 'accept', 'decline', 'revoke', 'create', 'update', etc.
    policy_id VARCHAR(255),
    policy_version VARCHAR(50),
    user_id VARCHAR(255),
    company_id VARCHAR(255),
    
    -- Action details
    action_data TEXT, -- JSON object with action-specific data
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    
    -- Result
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
    
    INDEX idx_action_type (action_type),
    INDEX idx_policy_id (policy_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Current acceptance status for all users and policies
CREATE VIEW user_policy_status AS
SELECT 
    u.id as user_id,
    u.email,
    u.name,
    u.company_id,
    p.id as policy_id,
    p.title as policy_title,
    p.type as policy_type,
    p.current_version,
    pv.deadline,
    pa.id as acceptance_id,
    pa.version as accepted_version,
    pa.accepted_at,
    pa.acceptance_type,
    pa.is_valid,
    CASE 
        WHEN pa.id IS NULL THEN 'pending'
        WHEN pa.version = p.current_version AND pa.is_valid = TRUE THEN 'accepted'
        WHEN pa.version != p.current_version THEN 'outdated'
        WHEN pv.deadline < NOW() THEN 'overdue'
        ELSE 'pending'
    END as status
FROM users u
CROSS JOIN policies p
LEFT JOIN policy_versions pv ON pv.policy_id = p.id AND pv.version = p.current_version
LEFT JOIN policy_acceptances pa ON pa.policy_id = p.id 
    AND pa.user_id = u.id 
    AND pa.is_valid = TRUE
WHERE u.is_active = TRUE AND p.is_active = TRUE;

-- Company-wide acceptance status
CREATE VIEW company_policy_status AS
SELECT 
    c.id as company_id,
    c.name as company_name,
    p.id as policy_id,
    p.title as policy_title,
    p.current_version,
    pa.id as acceptance_id,
    pa.accepted_at,
    pa.acceptor_name,
    pa.acceptor_title,
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT CASE WHEN upa.is_valid = TRUE THEN u.id END) as accepted_users
FROM companies c
CROSS JOIN policies p
LEFT JOIN policy_acceptances pa ON pa.company_name = c.name 
    AND pa.policy_id = p.id 
    AND pa.acceptance_type = 'company'
    AND pa.is_valid = TRUE
LEFT JOIN users u ON u.company_id = c.id AND u.is_active = TRUE
LEFT JOIN policy_acceptances upa ON upa.user_id = u.id 
    AND upa.policy_id = p.id 
    AND upa.is_valid = TRUE
WHERE c.is_active = TRUE AND p.is_active = TRUE
GROUP BY c.id, c.name, p.id, p.title, p.current_version, pa.id, pa.accepted_at, 
         pa.acceptor_name, pa.acceptor_title;

-- ============================================================================
-- SAMPLE QUERIES
-- ============================================================================

-- Get all pending policies for a user
/*
SELECT * FROM user_policy_status 
WHERE user_id = 'user-123' 
  AND status IN ('pending', 'outdated', 'overdue')
ORDER BY deadline ASC;
*/

-- Get acceptance history for a policy
/*
SELECT 
    pa.*,
    u.name as user_name,
    u.email as user_email
FROM policy_acceptances pa
JOIN users u ON u.id = pa.user_id
WHERE pa.policy_id = 'policy-123'
  AND pa.is_valid = TRUE
ORDER BY pa.accepted_at DESC;
*/

-- Get users who haven't accepted latest version
/*
SELECT 
    u.id,
    u.name,
    u.email,
    p.title as policy_title,
    p.current_version,
    pa.version as accepted_version
FROM users u
CROSS JOIN policies p
LEFT JOIN policy_acceptances pa ON pa.user_id = u.id 
    AND pa.policy_id = p.id 
    AND pa.is_valid = TRUE
WHERE u.is_active = TRUE 
  AND p.is_active = TRUE
  AND (pa.id IS NULL OR pa.version != p.current_version);
*/

-- Get company acceptance status
/*
SELECT * FROM company_policy_status
WHERE company_id = 'company-123';
*/
