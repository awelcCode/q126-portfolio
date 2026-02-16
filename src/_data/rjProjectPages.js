const rjProjects = require('./rjProjects.json');

module.exports = rjProjects.projects.filter(project => project.page === true);
