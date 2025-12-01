# Database Setup Guide

This document explains how to set up the database schema for the Policy Acceptance Module.

## Overview

The Policy Acceptance Module requires a relational database to store:

- User and company information
- Policy documents and versions
- Acceptance records with full audit trail
- Organization settings and permissions

## Supported Databases

The schema is written in standard SQL and compatible with:

- PostgreSQL (recommended)
- MySQL 8.0+
- MariaDB 10.5+
- SQLite (for development only)

## Quick Start

### 1. Create the Database

\`\`\`sql
CREATE DATABASE policy_acceptance;
\`\`\`

### 2. Run the Schema

Execute the SQL schema file:

\`\`\`bash

# PostgreSQL

psql -U username -d policy_acceptance -f docs/database-schema.sql

# MySQL

mysql -u username -p policy_acceptance < docs/database-schema.sql
\`\`\`

### 3. Verify Installation

\`\`\`sql
-- Check tables were created
SHOW TABLES;

-- Check views were created
SHOW FULL TABLES WHERE TABLE_TYPE = 'VIEW';
\`\`\`

## Database Schema

### Core Tables

#### users

Stores user accounts and permissions.

**Key fields:**

- `id`: Unique user identifier
- `email`: User's email address
- `role`: User role (user, admin, legal, company-admin)
- `company_id`: Associated company (optional)
- `can_accept_for_company`: Whether user can accept on behalf of company

#### companies

Stores organization/company information.

**Key fields:**

- `id`: Unique company identifier
- `name`: Company name
- `requires_company_acceptance`: Whether company-level acceptance is required
- `allow_individual_acceptance`: Whether individual users can accept separately

#### policies

Stores policy metadata and configuration.

**Key fields:**

- `id`: Unique policy identifier
- `type`: Policy type (terms, privacy, cookies, etc.)
- `title`: Human-readable policy title
- `current_version`: Currently active version identifier
- `requires_acceptance`: Whether acceptance is mandatory

#### policy_versions

Stores all versions of each policy with full content.

**Key fields:**

- `id`: Unique version identifier
- `policy_id`: Reference to parent policy
- `version`: Version string (e.g., "2.1", "2024-01-15")
- `content`: Full policy text/HTML
- `is_breaking`: Whether this is a breaking change requiring re-acceptance
- `deadline`: Deadline for acceptance (optional)

#### policy_acceptances

Tracks all policy acceptances with complete audit trail.

**Key fields:**

- `id`: Unique acceptance identifier
- `policy_id`: Policy that was accepted
- `version`: Version that was accepted
- `user_id`: User who accepted
- `acceptance_type`: "individual" or "company"
- `accepted_at`: Timestamp of acceptance
- `is_valid`: Whether acceptance is still valid (not revoked)

**Company acceptance fields** (when `acceptance_type = 'company'`):

- `company_name`: Company name
- `acceptor_name`: Name of person accepting
- `acceptor_title`: Title/role of acceptor
- `acceptor_email`: Email of acceptor

**Audit fields:**

- `ip_address`: IP address of acceptor
- `user_agent`: Browser/device information
- `location`: Geographic location (if available)

### Supporting Tables

#### company_admins

Maps which users can accept policies on behalf of their company.

#### organization_settings

Stores company-level configuration for policy acceptance workflows.

#### policy_audit_log

Comprehensive audit trail of all policy-related actions.

### Views

#### user_policy_status

Shows current acceptance status for all user-policy combinations.

**Status values:**

- `accepted`: User has accepted current version
- `pending`: User hasn't accepted yet
- `outdated`: User accepted old version, new version available
- `overdue`: Past deadline without acceptance

#### company_policy_status

Shows company-wide acceptance status including user rollup.

## Common Queries

### Get User's Pending Policies

\`\`\`sql
SELECT
policy_id,
policy_title,
current_version,
deadline,
status
FROM user_policy_status
WHERE user_id = ?
AND status IN ('pending', 'outdated', 'overdue')
ORDER BY deadline ASC NULLS LAST;
\`\`\`

### Check if User Accepted Policy

\`\`\`sql
SELECT EXISTS (
SELECT 1
FROM policy_acceptances
WHERE user_id = ?
AND policy_id = ?
AND version = (SELECT current_version FROM policies WHERE id = ?)
AND is_valid = TRUE
) as has_accepted;
\`\`\`

### Get Company Acceptance for Policy

\`\`\`sql
SELECT
pa.\*,
u.name as acceptor_user_name
FROM policy_acceptances pa
LEFT JOIN users u ON u.id = pa.acceptor_user_id
WHERE pa.policy_id = ?
AND pa.acceptance_type = 'company'
AND pa.company_name = ?
AND pa.is_valid = TRUE
ORDER BY pa.accepted_at DESC
LIMIT 1;
\`\`\`

### Get All Acceptances for a Policy Version

\`\`\`sql
SELECT
pa.id,
pa.accepted_at,
pa.acceptance_type,
u.name as user_name,
u.email as user_email,
pa.company_name,
pa.acceptor_name
FROM policy_acceptances pa
JOIN users u ON u.id = pa.user_id
WHERE pa.policy_id = ?
AND pa.version = ?
AND pa.is_valid = TRUE
ORDER BY pa.accepted_at DESC;
\`\`\`

### Get Users Who Need to Accept New Version

\`\`\`sql
SELECT
u.id,
u.name,
u.email,
pa.version as old_version,
p.current_version as new_version
FROM users u
CROSS JOIN policies p
LEFT JOIN policy_acceptances pa ON pa.user_id = u.id
AND pa.policy_id = p.id
AND pa.is_valid = TRUE
WHERE u.is_active = TRUE
AND p.id = ?
AND (pa.id IS NULL OR pa.version != p.current_version);
\`\`\`

## Indexes

The schema includes indexes on commonly queried fields:

- User lookups: `email`, `company_id`, `role`
- Policy lookups: `type`, `is_active`, `current_version`
- Acceptance lookups: `(policy_id, user_id)`, `user_id`, `accepted_at`
- Version lookups: `(policy_id, version)`, `deadline`

## Data Retention

The schema includes settings for data retention:

- `policies.retention_period_days`: How long to keep policy data
- `organization_settings.retention_period_years`: Audit log retention

Implement automated cleanup jobs based on these settings:

\`\`\`sql
-- Example: Delete old audit logs
DELETE FROM policy_audit_log
WHERE created_at < NOW() - INTERVAL ? YEAR;

-- Example: Archive old policy versions
UPDATE policy_versions
SET is_active = FALSE
WHERE created_at < NOW() - INTERVAL ? DAY
AND version != (SELECT current_version FROM policies WHERE id = policy_id);
\`\`\`

## Migrations

When updating policy versions:

\`\`\`sql
-- 1. Create new version
INSERT INTO policy_versions (id, policy_id, version, content, is_breaking, created_by)
VALUES (?, ?, ?, ?, ?, ?);

-- 2. Update current version
UPDATE policies
SET current_version = ?, updated_at = NOW()
WHERE id = ?;

-- 3. Optionally invalidate old acceptances if breaking change
UPDATE policy_acceptances
SET is_valid = FALSE
WHERE policy_id = ?
AND version != ?
AND ? = TRUE; -- is_breaking parameter
\`\`\`

## Backup Recommendations

- **Daily backups** of the entire database
- **Real-time replication** for high-availability setups
- **Point-in-time recovery** enabled for compliance requirements
- **Encrypted backups** stored in multiple geographic locations
- **Regular backup testing** to ensure recoverability

## Security Considerations

1. **Encryption at rest**: Enable database encryption
2. **Encryption in transit**: Use TLS/SSL for connections
3. **Access control**: Restrict database access to application servers only
4. **Audit logging**: Enable database-level audit logs
5. **Regular updates**: Keep database software patched
6. **Sensitive data**: Consider hashing/encrypting sensitive fields like IP addresses

## Performance Tips

1. **Add indexes** for your specific query patterns
2. **Partition tables** for large datasets (by date or policy_id)
3. **Archive old data** to separate tables/databases
4. **Use connection pooling** in your application
5. **Monitor slow queries** and optimize as needed
6. **Consider read replicas** for high-traffic scenarios

## Next Steps

After setting up the database:

1. Create initial admin user
2. Set up organization settings
3. Import your first policy
4. Configure the application to connect to the database
5. Test the acceptance workflow

See the main [README.md](../README.md) for application setup instructions.
