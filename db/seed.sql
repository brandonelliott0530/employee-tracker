
INSERT INTO departments (name)
    VALUES
        ('Management'),
        ('Accoutning'),
        ('Sales'),
        ('Engineering'),
        ('Human Resources'),
        ('Service'),
        ('Parts'),
        ('BDC');



INSERT INTO roles (title, salary, department_id)
    VALUES 
        ('Administrator', 100000, 1),
        ('Accountant', 75000, 2),
        ('Sales Representative', 90000, 3),
        ('Designer', 100000, 4),
        ('HR administrator', 80000, 5),
        ('Service Tecnician', 65000, 6),
        ('Parts Advisor', 80000, 7),
        ('BDC Clerk', 50000, 8);




INSERT INTO employees (first_name, last_name, roles_id, manager_id)
    VALUES  
        ('Brandon', 'Elliott', 1, 1),
        ('Dani', 'Ribiero', 2, 2),
        ('Tina', 'Elliott', 3, 2),
        ('George', 'Elliott', 4, 2),
        ('Sarah', 'Elliott', 5, 2),
        ('Aimee', 'Elliott', 6, 2),
        ('Louis', 'Solis', 7, 2),
        ('Nick', 'Strates', 8, 2);
           
