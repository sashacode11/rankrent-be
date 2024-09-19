# rankrent-be
```
npm init -y
npm i express
npm i --save-dev nodemon
npm i ejs
#npm i express pug
npm i csv-parser
npm i js-yaml
npm i mysql
npm i nodemailer
npm run devStart
```

Step-by-Step Guide to Setup MariaDB

Step 1: Install MariaDB
Ensure MariaDB is installed on your server. Installation guides and downloads can be found on the MariaDB official website.

Step 2: Create the Database and Table
You can use the following SQL commands to create your database and customer table:
```
mysql -u root -p
```
```
CREATE DATABASE InquiritaBilling;

USE InquiritaBilling;

CREATE TABLE Customers (
    CustomerNumber INT AUTO_INCREMENT PRIMARY KEY,
    CustomerName VARCHAR(255) NOT NULL,
    EmailAddress VARCHAR(255) NOT NULL UNIQUE
);
```

Step 3: Inserting Data
To add data to your Customers table:
```
INSERT INTO Customers (CustomerName, EmailAddress) VALUES ('John Doe', 'john.doe@example.com');
```

Step 4: Querying Data
To retrieve data from your Customers table:
```
SELECT * FROM Customers;
```

Adding table data in InquiritaBilling

Step 1: Ensure the Database is Selected
```
USE InquiritaBilling;
```
Step 2: Create the TermAmounts Table
Here’s the SQL command to create the TermAmounts table:
```
CREATE TABLE TermAmounts (
    termId INT AUTO_INCREMENT PRIMARY KEY,
    term VARCHAR(50),
    amount DECIMAL(10, 2)
);
```

Step 4: Verify Table Creation
```
DESCRIBE TermAmounts;
```

Step 5: Insert Initial Data
```
INSERT INTO TermAmounts (term, amount) VALUES
('1 month', 100.00),
('3 months', 280.00),
('6 months', 550.00),
('12 months', 1000.00);
```
Step 6: Querying data
```
SELECT * FROM TermAmounts;
```


Adding Locni table in InquiritaBilling

Step 1: Create a New Table for Locni Types
```
CREATE TABLE LocniTypes (
    locniId INT AUTO_INCREMENT PRIMARY KEY,
    locniType VARCHAR(100)
);
```
Step 2: Insert Locni Types
```
INSERT INTO LocniTypes (locniType) VALUES ('CPA'), ('Tree Service');
```
Step 3: Create a New Pricing Table
```
CREATE TABLE LocniPricing (
    pricingId INT AUTO_INCREMENT PRIMARY KEY,
    termId INT,
    locniId INT,
    amount DECIMAL(10, 2),
    FOREIGN KEY (termId) REFERENCES TermAmounts(termId),
    FOREIGN KEY (locniId) REFERENCES LocniTypes(locniId)
);
```
Step 4: Insert Pricing Data
```
INSERT INTO LocniPricing (termId, locniId, amount) VALUES
(1, 1, 120.00),  -- 1 month for CPA
(1, 2, 110.00),  -- 1 month for Tree Service
(2, 1, 300.00),  -- 3 months for CPA
(2, 2, 280.00),  -- 3 months for Tree Service
(3, 1, 600.00),  -- 6 months for CPA
(3, 2, 550.00),  -- 6 months for Tree Service
(4, 1, 1100.00), -- 12 months for CPA
(4, 2, 1000.00); -- 12 months for Tree Service
```
Step 5: Querying the Pricing Data
```
SELECT t.term, l.locniType, p.amount
FROM LocniPricing p
JOIN TermAmounts t ON p.termId = t.termId
JOIN LocniTypes l ON p.locniId = l.locniId
WHERE l.locniType = 'CPA' AND t.term = '3 months';
```

Using OpenSSL to Generate a Self-Signed Certificate to Integrate Apple Pay
Step 1: Generate a Private Key
```
openssl genrsa -out localhost.key 2048
```
This command creates a file named localhost.key containing your private key.

Step 2: Generate a Self-Signed SSL Certificate
```
openssl req -new -x509 -key localhost.key -out localhost.crt -days 365 -subj "/CN=localhost"
```

