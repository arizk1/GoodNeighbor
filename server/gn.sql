DROP  TABLE IF EXISTS users;
DROP  TABLE IF EXISTS user_profile;
DROP  TABLE IF EXISTS reset_codes;
DROP  TABLE IF EXISTS map_coordinates;
DROP  TABLE IF EXISTS tools;
DROP  TABLE IF EXISTS requests;



CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK (first != ''),
    last VARCHAR(255) NOT NULL CHECK (last != ''),
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
    password VARCHAR(255) NOT NULL CHECK (password != ''),
    profile_pic VARCHAR(255),
    bio VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE user_profile(
    id SERIAL PRIMARY KEY,
    postal_code INTEGER,
    house_number INTEGER,
    street VARCHAR(255),
    city VARCHAR(255),
    user_id INT NOT NULL UNIQUE REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE map_coordinates(
    id SERIAL PRIMARY KEY,
    place_id VARCHAR,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    user_id INT NOT NULL UNIQUE REFERENCES users(id)
);


CREATE TABLE tools(
    id SERIAL PRIMARY KEY,
    type VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    condition TEXT,
    url VARCHAR,
    available BOOLEAN DEFAULT true,
    user_id INT NOT NULL REFERENCES users(id),
    recipient_id INT REFERENCES users(id),
    until DATE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requests(
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL REFERENCES tools(id),
    owner_id INT NOT NULL REFERENCES users(id),
    borwer_id INT NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

