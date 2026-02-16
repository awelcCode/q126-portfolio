const rejuvenationWork = require('./rejuvenationWork.json');

module.exports = rejuvenationWork.projects.filter(project => project.hasPage === true);

