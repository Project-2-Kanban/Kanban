CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE PRIORITY AS ENUM ('Nenhuma', 'Baixa', 'Média', 'Alta');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password CHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS board_members (
    board_id UUID NOT NULL,
    user_id UUID NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (board_id, user_id),
    FOREIGN KEY (board_id) REFERENCES boards(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    board_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT unique_column_position UNIQUE (position, board_id)
);

CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority PRIORITY NOT NULL,
    column_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (column_id) REFERENCES columns(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS card_members (
    user_id UUID NOT NULL,
    card_id UUID NOT NULL,
    PRIMARY KEY (user_id, card_id),
    FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (card_id) REFERENCES cards(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE OR REPLACE FUNCTION set_column_position()
RETURNS TRIGGER AS $$
BEGIN
    SELECT COALESCE(MAX(position), 0) + 1 INTO NEW.position
    FROM columns
    WHERE board_id = NEW.board_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_column
BEFORE INSERT ON columns
FOR EACH ROW
EXECUTE FUNCTION set_column_position();

CREATE OR REPLACE FUNCTION adjust_column_positions()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE columns
    SET position = position - 1
    WHERE board_id = OLD.board_id
      AND position > OLD.position;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_delete_column
AFTER DELETE ON columns
FOR EACH ROW
EXECUTE FUNCTION adjust_column_positions();