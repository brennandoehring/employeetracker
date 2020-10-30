const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

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
        type: "list",
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
    inquirer.prompt([
    {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
    }, 
    {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
    },
    {
        name: "role",
        type: "list",
        message: "What is this employee's role?",
        choices: roleSelect()
    }, 
    {
        name: "manager",
        type: "list",
        message: "What is this employee's manager's name?",
        choices: managerSelect()
    }
  ])
    .then(function(answers) {
      let roleID = roleSelect().indexOf(answers.role) + 1;
      let managerID = managerSelect().indexOf(answers.manager) + 1;
      connection.query("INSERT INTO employee SET ?", 
      {
        first_name: answers.firstName,
        last_name: answers.lastName,
        role_id: roleID,
        manager_id: managerID
      }, function(err) {
        if (err) throw err;
        console.log("Added employee!");
      });
      commandsDisplay();
    });
  }

  function viewEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function(err, res) {
      if (err) throw err;
      console.table(res);
      commandsDisplay();
    });
  }

  function viewRoles() {
  
  }

  function viewDepartments() {

  }

  function updateEmployee() {
      
  }

  let roleArr = [];
  function roleSelect() {
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        roleArr.push(res[i].title);
      }
    });
    return roleArr;
  }

  let managersArr = [];
  function managerSelect() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        managersArr.push(res[i].first_name);
      }
    });
    return managersArr;
  }