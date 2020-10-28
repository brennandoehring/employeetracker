const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "companyDB"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    commandsDisplay();
  });

  function commandsDisplay() {
    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "Add Employee",
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "Update Employee Roles"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Add Employee":
          addEmployee();
          break;
  
        case "View All Employees":
          viewEmployees();
          break;
  
        case "View All Roles":
          viewRoles();
          break;
  
        case "View All Departments":
          viewDepartments();
          break;
  
        case "Update Employee Roles":
          updateEmployee();
          break;
        }
    });
  }

function addEmployee() {
    inquirer.prompt(
    {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?"
    }, 
    {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?"
    },
    {
        name: "role_id",
        type: "input",
        message: "What is this employee's role?"
    }, 
    {
        name: "manager_id",
        type: "input",
        message: "Does this employee have a manager? If so, what is their manager's ID?"
    })
    .then(function(answer) {
        const query = "";
        connection.query(query, { }, function(err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log("");
            }
            commandsDisplay();
        });
    });
}

function viewEmployees() {
    
}

function viewRoles() {

}

function viewDepartments() {

}

function updateEmployee() {
    
}