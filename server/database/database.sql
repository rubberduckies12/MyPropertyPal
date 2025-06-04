-- landlordproject;

CREATE TABLE IF NOT EXISTS role (
    id INT PRIMARY KEY,
    name VARCHAR(15) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS property_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO property_status (status) VALUES
    ('Available'),
    ('Occupied'),
    ('Under Maintenance'),
    ('Not Available')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS property (
    id SERIAL PRIMARY KEY,
    landlord INT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    county VARCHAR(50) NOT NULL,
    postcode VARCHAR(10) NOT NULL,
    flat_number VARCHAR(10) NULL,
    property_status INT NOT NULL REFERENCES property_status(id) DEFAULT 4
);

CREATE TABLE IF NOT EXISTS user (
    id INT PRIMARY KEY CHECK (id > 0),
    role INT NOT NULL REFERENCES role(id),
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    property INT NULL REFERENCES property(id)
);