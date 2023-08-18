module.exports = (sequelize, DataTypes) => {
    const ProdutoXFornecedor = sequelize.define('ProdutoXFornecedor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      created_at: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      created_by: {
        type: DataTypes.STRING,
        field: 'created_by',
      },
      updated_at: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
      updated_by: {
        type: DataTypes.STRING,
        field: 'updated_by',
      },
      deleted_at: {
        type: DataTypes.DATE,
        field: 'deleted_at',
      },
      deleted_by: {
        type: DataTypes.STRING,
        field: 'deleted_by',
      },
    }, {
        sequelize,
        modelName: 'produtoxfornecedor',
        tableName: 'produtoxfornecedor',
        timestamps: false,
        // underscored: true
    });
  
    ProdutoXFornecedor.associate = (models) => {
      ProdutoXFornecedor.belongsTo(models.Produto, {
        foreignKey: 'produto_id',
        as: 'produto',
      });
      ProdutoXFornecedor.belongsTo(models.Fornecedor, {
        foreignKey: 'fornecedor_id',
        as: 'fornecedor',
      });
    };
  
    return ProdutoXFornecedor;
  };
  