INSERT INTO users (email, username, first_name, last_name, password_hash, role) VALUES 
('user1@example.com', 'userone', 'John', 'Doe', 'hashed_password_1', 'user'),
('admin@example.com', 'adminuser', 'Alice', 'Smith', 'hashed_password_2', 'admin'),
('user2@example.com', 'usertwo', 'Jane', 'Roe', 'hashed_password_3', 'user');

INSERT INTO lessons (title, description, start_date, end_date, recurrence_rule, location, capacity) VALUES
('Social Dance', 'Ballroom dance', '2026-01-05 18:00:00', '2026-06-30 19:00:00', 'weekly', 'hall 2', 20),
('Social Dance - Beginner', 'Ballroom dance beginner class', '2026-01-05 18:00:00', '2026-06-30 19:00:00', 'weekly', 'hall 3', 20),
('Social Dance - Intermediate', 'Ballroom dance intermediate class', '2026-01-05 18:00:00', '2026-06-30 19:00:00', 'weekly', 'hall 4', 20),
('Social Dance - Advanced', 'Ballroom dance advanced class', '2026-01-05 18:00:00', '2026-06-30 19:00:00', 'weekly', 'hall 2', 20),
('Hip Hop', 'Energetic hip hop class', '2026-01-06 17:00:00', '2026-06-30 18:00:00', 'weekly', 'hall 3', 20),
('Salsa', 'Salsa dance class', '2026-01-07 18:00:00', '2026-06-30 19:00:00', 'weekly', 'hall 4', 20),
('Bachata', 'Bachata dance class', '2026-01-08 18:00:00', '2026-06-30 19:00:00', 'weekly', 'hall 2', 20),
('Modern Dance', 'Contemporary dance class', '2026-01-09 18:00:00', '2026-06-30 19:00:00', 'weekly', 'hall 4', 20);

INSERT INTO reservations (user_id, lesson_id, status) VALUES
(1, 1, 'active'),
(2, 1, 'pending'),
(3, 2, 'active'),
(1, 3, 'active'),
(2, 4, 'active'),
(3, 5, 'pending');