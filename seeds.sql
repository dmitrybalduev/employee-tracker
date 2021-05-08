use employeesDB;

INSERT INTO employees (first_name, last_name, role_id, manager_id ) 
VALUES 
("Dmitry", "Balduev", 1, 2), 
("John", "Doe", 2, NULL), 
("Albert", "Si", 3, 1)
("Walter", "White", 4, 3)
("Jesse", "Pinkman", 5, NULL);;

INSERT INTO departments(name)
VALUES 
("Sales"),
("Marketing"),
("IT"),
("Support"),
("HR");

INSERT INTO roles(title, salary, deparment_id)
VALUES
("Full Stack Developer", 120000.13, 3),
("HR manager", 70000.50, 5),
("Sales person", 80000, 1),
("Manager", 90000, 2),
("Accountant", 50000, 4);