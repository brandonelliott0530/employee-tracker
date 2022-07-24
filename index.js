// Brings in inquirer
const inquirer = require('inquirer');
const logo = require('asciiart-logo')
const query = require("./config/connection")



const viewDepartments =  () => {
   query('SELECT * FROM departments', (err, result) => {
    if (err) {
      console.error(err);
    }else {
        console.table(result)
        initialPrompt()
    }
    
  });
  
};

const viewRoles = () => {
     query('SELECT * FROM roles', (err, result) => {
        if(err) {
            console.error(err)
        } else {
            console.table(result)
            initialPrompt()
        }
        
    })
   
}

const viewEmployees = () => {
    query('SELECT * FROM employees', (err, result) => {
        if(err) {
            console.error(err)
        } else {
            console.table(result)
            initialPrompt()
        }
       
    })
    console.log("Now viewing all company employees.")
}

const renderDepartmentChoices = async () => {
const departments = await query('SELECT name, id FROM departments')
   return departments.map(({name, id}) => {
    return {
        name,
        value: id,
    }
   })
}

const newDepartment = async () => {
    const {department} = await inquirer.prompt([
        {
            message: "What is the name of the new department",
            type: 'list',
            name: "department",
            choices: [
                renderDepartmentChoices()
            ]
        }
    ])
    query('INSERT INTO departments (name) VALUES (?)', department, (err, result)=>{
        if(err) {console.error(err)
        }else {  console.table(viewDepartments())
            initialPrompt()
        }
        
    })
    
    
}


const renderRoleChoices = async () => {
    const roles = await query('SELECT name, id, FROM roles')
    return roles.map(({name, id}) => {
        return {
            name,
            value: id,
        }
    })
}


const newRole = async () => {
    
   const {title, salary, departmentId} = await inquirer.prompt([
    {
        message: 'What is the title of the new role?',
        name: 'title',
    },
    {
        message: 'What is the salary for the new role?',
        name: 'salary'
    },
    {
        message: 'What department is the new role for?',
        type: 'list',
        name: 'departmentId',
        choices: await renderRoleChoices(),
    }
])

 await query(
    'INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)',
    [title, salary, departmentId]
 );
    viewRoles()
 }


const newEmployee = async () => {
    const {firstName, lastName, roleId, managerId} = await inquirer.prompt([
        {
            message: "What is the first name of the new employee?",
            name: 'firstName',
        },
        {
            message: 'What is the last name of the new employee?',
            name: 'lastName'
        },
        {
            message: 'What is the role id for the new employee?',
            name: 'roleId'
        },
        {
            message: 'What is the manager id for the new employee?',
            name: 'managerId'
        }
    ])
    query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [firstName, lastName, roleId, managerId], (err, result)=>{
        if(err) console.error(err)
    })
}
const updateRole = () => {
    console.log("Updating role of selected employee.")
}
const quit = () => {
    console.log("Now exiting the application. Thank you for using Employee Tracker.")
    process.exit()
}

const choiceMap = {
    viewDepartments,
    viewRoles,
    viewEmployees,
    newDepartment,
    newRole,
    newEmployee,
    updateRole,
    quit
}

const handleChoice = async (choices) => {
   await choiceMap[choices]()
    if(choices !== 'quit') {
        initialPrompt()
    }
}

const initialPrompt = async () => {
    const response = await inquirer.prompt([
    {
        message: "Please select one of the following options",
        type: "list",
        name: "userChoice",
        choices: [
             {
                name: "View all departments",
                value: "viewDepartments"
             },
             {
                name: "View all roles",
                value: "viewRoles"
             },
             {
                name: "View all employees",
                value: "viewEmployees"
             },
             {
                name: "Add a department",
                value: "newDepartment"
             },
             {
                name: "Add a role",
                value: "newRole"
             },
             {
                name: "Add a employee",
                value: "newEmployee"
             },
             {
                name: "Update employee role",
                value: "updateRole"
             },
             {
                name: "Exit application",
                value: "quit"
             }       
        ]
    }
])
handleChoice(response.userChoice)
}

console.log(logo({name: "Employee Tracker"}).render())
initialPrompt()

