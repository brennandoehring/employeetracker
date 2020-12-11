const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

// Create MySQL connection
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

  // Initial "home" prompt
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

  // Add employee function
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

  // View all employees function
  function viewEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function(err, res) {
      if (err) throw err;
      console.table(res);
      commandsDisplay();
    });
  }

  // View all roles function
  function viewRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
    function(err, res) {
      if (err) throw err;
      console.table(res);
      commandsDisplay();
    });
  }

  // View all departments function
  function viewDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
    function(err, res) {
      if (err) throw err;
      console.table(res);
      commandsDisplay();
    });
  }

  // Update employee function
  async function updateEmployee() {
      connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
      function(err, res) {
        if (err) throw err;
        console.log(res);
        inquirer.prompt([
          {
            name: "lastName",
            type: "list",
            choices: function() {
              let lastName = [];
              for (let i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
              },
              message: "What is the employee's last name?",
            },
            {
              name: "role",
              type: "list",
              message: "What is this employee's new role?",
              choices: roleSelect()
            },
        ]).then(function(answers) {
          let roleID = roleSelect().indexOf(answers.role) + 1;
          connection.query("UPDATE employee SET WHERE ?",
          {
            last_name: answers.lastName
          },
          {
            role_id: roleID
          },
          function(err){
            if (err) throw err;
            console.table(answers);
            commandsDisplay();
          })
        });
      });
  }

  // Role select function for inquirer choices
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

  // Manager select function for inquirer choices
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