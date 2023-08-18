module.exports = (sequelize, DataTypes) => {
  const Precos = sequelize.define('Precos', {
    valor: DataTypes.DECIMAL,
    desconto: DataTypes.DECIMAL,
    precoMedio: DataTypes.DECIMAL,
    data: DataTypes.DATE,
    created_at: {
      allowNull: true,
      type: DataTypes.DATE,
      field: 'created_at',
    },
    created_by: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'created_by',
    },
    updated_at: {
      allowNull: true,
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    updated_by: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'updated_by',
    },
    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE,
      field: 'deleted_at',
    },
    deleted_by: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'deleted_by',
    },
  }, {
    tableName: 'precos',
    timestamps: false, // Habilita a criação automática das colunas createdAt e updatedAt
  });

  Precos.associate = (models) => {
    Precos.belongsTo(models.Produto, {
      foreignKey: 'produto_id',
      as: 'produto',
    });
  };

  return Precos;
};