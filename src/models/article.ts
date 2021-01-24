import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { MenuContent } from "./menu_content";

export interface ArticleInterface {
    id: number;
    name: string;
    price: number;
    code_type_src: number;
    picture: string;
    description: string;
  }
  
  
export class Article extends Model {
    public id!: number;
    public name!: string;
    public price!: number;
    public code_type_src!: number;
    public picture!: string;
    public description!: string;
  }

  Article.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      code_type_src: {
        type: new DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: new DataTypes.INTEGER,
        defaultValue: 0,
      },
      picture: {
        type: new DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: new DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "article",
      sequelize: sequelize , 
      timestamps: false
    }
  );

  Article.hasMany(MenuContent, {
    sourceKey: "id",
    foreignKey: "id_article",
    onDelete: "SET NULL"
  });
  
  
  MenuContent.belongsTo(Article, {
    foreignKey: {
      name: 'id_article'
    }
  });