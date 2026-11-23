-- Wisal Digital Invitations - RSVP Database Schema
-- UTF-8 MB4 for full Arabic script & Emoji compatibility

CREATE TABLE IF NOT EXISTS invitations (
  id VARCHAR(64) PRIMARY KEY,
  owner_key_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invitation_id VARCHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  attending ENUM('yes', 'no') NOT NULL,
  guests TINYINT UNSIGNED NOT NULL DEFAULT 1,
  message TEXT DEFAULT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_responses_invitation_id FOREIGN KEY (invitation_id) REFERENCES invitations (id) ON DELETE CASCADE,
  INDEX idx_responses_invitation_id (invitation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
