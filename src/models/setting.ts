import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { log } from "../config/log_config";

export interface SettingInterface {
    id: number;
    hour_limit: Date;
    nb_limit_per_day: number;
    nb_limit_per_account: number;
    order_in_advance: boolean;
  }
  
  
export class Setting extends Model {
    public id!: number;
    public hour_limit!: Date;
    public nb_limit_per_day!: number;
    public nb_limit_per_account!: number;
    public order_in_advance!: boolean;
  }

  Setting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      hour_limit: {
        type: DataTypes.TIME,
        defaultValue: '12:00:00',
      },
      nb_limit_per_day: {
        type: new DataTypes.INTEGER,
        defaultValue: 10,
      },
      nb_limit_per_account: {
        type: new DataTypes.INTEGER,
        defaultValue: 1,
      },
      order_in_advance: {
        type: new DataTypes.STRING,
        defaultValue: false,
      },
    },
    {
      tableName: "setting",
      sequelize: sequelize , 
      timestamps: false
    }
  );


Setting.findAll<Setting>({
    raw: true,
  }).then(function(data) {
    if(data.length == 0)
        {
          log.warn("Paramètre d'api non trouvé ! Création de paramètre par défaut");
          Setting.create();
          log.warn('Paramètre par défaut créé');
        }
  });
  
  
