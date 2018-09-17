
module.exports = function (sequelize, Sequelize) {

	var Epgs = sequelize.define('epgs', {
		id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
		channelId: {type: Sequelize.STRING, allowNull: false},
		start: {type: Sequelize.STRING, allowNull: false},
		stop: {type: Sequelize.STRING, allowNull: false},
		title: {type: Sequelize.STRING, notEmpty: true},
		category: {type: Sequelize.STRING, notEmpty: true}
	},
	{
		createdAt: false,
		// I want updatedAt to actually be called updateTimestamp
		updatedAt: false,
	});
	return Epgs;

}