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

-- Pre-seed default invitations so guests can immediately RSVP & send wishes
INSERT IGNORE INTO invitations (id, owner_key_hash) VALUES
  ('inv_mohamed_salma', SHA2('mohamed_salma_key', 256)),
  ('inv_mohamed_salma_v2', SHA2('mohamed_salma_key', 256)),
  ('inv_velvet_voice', SHA2('velvet_voice_key', 256)),
  ('inv_mazen_farida', SHA2('mazen_farida_key', 256)),
  ('inv_velvet', SHA2('velvet_key', 256)),
  ('inv_rosearch', SHA2('rosearch_key', 256)),
  ('inv_lune', SHA2('lune_key', 256)),
  ('inv_pearl', SHA2('pearl_key', 256)),
  ('inv_veil', SHA2('veil_key', 256)),
  ('inv_sage_garden', SHA2('sage_garden_key', 256)),
  ('inv_adam_jana', SHA2('adam_jana_key', 256)),
  ('inv_ahmed_mia', SHA2('ahmed_mia_key', 256));
