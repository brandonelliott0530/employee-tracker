require("events").EventEmitter.defaultMaxListeners = 1000;
require("dotenv").config();

// Brings in inquirer
const inquirer = require("inquirer");
// Brings in the logo for the beginning of the program
const logo = require("asciiart-logo");
// Brings in the config file that sets up the connection to mysql
const query = require("./config/connection");

// Function to view all departments in the database
const viewDepartments = () => {
  query("SELECT * FROM departments", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.table(result);
    }
  });
};

// Function to view all roles in the database
const viewRoles = () => {
  query("SELECT * FROM roles", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.table(result);
    }
  });
};

// Function to view all employees in the database
const viewEmployees = () => {
  query("SELECT * FROM employees", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.table(result);
    }
  });
};

// Function that retuns all employees in the database for updating their role in the company
const getEmployees = async () => {
  const employee = await query(
    "SELECT first_name, last_name, id FROM employees"
  );
  return employee.map((employee) => {
    return {
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    };
  });
};

// Function to render the departmets as choices in inquirer
const renderDepartmentChoices = async () => {
  const departments = await query("SELECT name, id FROM departments");
  return departments.map(({ name, id }) => {
    return {
      name,
      value: id,
    };
  });
};

// Function to add a new department to the list of departments
const newDepartment = async () => {
  const { department } = await inquirer.prompt([
    {
      message: "What is the name of the new department",
      name: "department",
    },
  ]);
  await query("INSERT INTO departments (name) VALUES (?)", department);
  viewDepartments();
};

// Function to render the roles as choices in inquirer.
const renderRoleChoices = async () => {
  const roles = await query("SELECT title, id FROM roles");
  return roles.map(({ id, title }) => {
    return {
      value: id,
      name: title,
    };
  });
};

// function for adding a new role to the database
const newRole = async () => {
  const { title, salary, departmentId } = await inquirer.prompt([
    {
      message: "What is the title of the new role?",
      name: "title",
    },
    {
      message: "What is the salary for the new role?",
      name: "salary",
    },
    {
      message: "What department is the new role for?",
      type: "list",
      name: "departmentId",
      choices: await renderDepartmentChoices(),
    },
  ]);

  await query(
    "INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)",
    [title, salary, departmentId]
  );
  viewRoles();
};

// Function for adding a new employee to the database
const newEmployee = async () => {
  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
      message: "What is the first name of the new employee?",
      name: "firstName",
    },
    {
      message: "What is the last name of the new employee?",
      name: "lastName",
    },
    {
      message: "What is the role id for the new employee?",
      name: "roleId",
      type: "list",
      choices: await renderRoleChoices(),
    },
    {
      message: "Who is the manager of the new employee?",
      name: "managerId",
      type: "list",
      choices: await getEmployees(),
    },
  ]);
  query(
    "INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?)",
    [firstName, lastName, roleId, managerId],
    (err, result) => {
      if (err) console.error(err);
    }
  );
  viewEmployees();
};

// Function to update the role of an employee
const updateRole = async () => {
  const { employee_id, roles_id } = await inquirer.prompt([
    {
      type: "list",
      message: "Which employee do you want to update?",
      name: "employee_id",
      choices: await getEmployees(),
    },
    {
      type: "list",
      message: "Which new role do you want to give to the employee?",
      name: "roles_id",
      choices: await renderRoleChoices(),
    },
  ]);
  try {
    await query("UPDATE employees SET roles_id = ? WHERE id = ? ", [
      roles_id,
      employee_id,
    ]);
    console.table(viewEmployees());
  } catch (err) {
    console.log(err);
  }
};
// function to quit the program
const quit = () => {
  console.log(
    "Now exiting the application. Thank you for using Employee Tracker."
  );
  process.exit();
};

const choiceMap = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  newDepartment,
  newRole,
  newEmployee,
  updateRole,
  quit,
};

const handleChoice = async (choices) => {
  await choiceMap[choices]();
  if (choices !== "quit") {
    initialPrompt();
  }
};

// Function that presents the initial prompt to the user.
const initialPrompt = async () => {
  const response = await inquirer.prompt([
    {
      message: "Please select one of the following options",
      type: "list",
      name: "userChoice",
      choices: [
        {
          name: "View all departments",
          value: "viewDepartments",
        },
        {
          name: "View all roles",
          value: "viewRoles",
        },
        {
          name: "View all employees",
          value: "viewEmployees",
        },
        {
          name: "Add a department",
          value: "newDepartment",
        },
        {
          name: "Add a role",
          value: "newRole",
        },
        {
          name: "Add a employee",
          value: "newEmployee",
        },
        {
          name: "Update employee role",
          value: "updateRole",
        },
        {
          name: "Exit application",
          value: "quit",
        },
      ],
    },
  ]);

  handleChoice(response.userChoice);
};

console.log(logo({ name: "Employee Tracker" }).render());
initialPrompt();
