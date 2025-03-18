import User from './User';
import Event from './Event';

User.hasMany(Event, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'events'
});

Event.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

export {
  User,
  Event
};