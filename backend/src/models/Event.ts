import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';

export enum EventImportance {
  NORMAL = 'Звичайна',
  IMPORTANT = 'Важлива',
  CRITICAL = 'Критична'
}

interface EventAttributes {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  importance: EventImportance;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id'> {}

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public startDate!: Date;
  public endDate!: Date | undefined;
  public importance!: EventImportance;
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    importance: {
      type: DataTypes.ENUM(...Object.values(EventImportance)),
      allowNull: false,
      defaultValue: EventImportance.NORMAL
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'events'
  }
);

export default Event;