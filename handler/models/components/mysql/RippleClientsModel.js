module.exports = function (Connection, { DataTypes, Model, Op }) {
    const tableName = 'ripple_client'

    const scheme = {
        client_id: { type: DataTypes.INTEGER(11), autoIncrement: true, primaryKey: true },
        client_username: { type: DataTypes.STRING(45) },
        client_tagline: { type: DataTypes.STRING(255) },
        client_logo: { type: DataTypes.STRING(255) },
        client_name: { type: DataTypes.STRING(200) },
        client_email: { type: DataTypes.STRING(100) },
        client_address: { type: DataTypes.STRING(255) },
        client_contact: { type: DataTypes.STRING(100) },
        client_class: { type: DataTypes.STRING(100) },
        client_status: { type: DataTypes.INTEGER(1) },
        client_theme: { type: DataTypes.STRING(255) },
        client_register_date: { type: DataTypes.DATE, defaultValue: '1990-01-01 00:00:00' },
        client_duedate: { type: DataTypes.DATE, defaultValue: '1990-01-01 00:00:00' },
        time_add: { type: DataTypes.DATE, defaultValue: '1990-01-01 00:00:00' },
        time_update: { type: DataTypes.DATE, defaultValue: '1990-01-01 00:00:00' },
        user_add: { type: DataTypes.INTEGER(11) },
        user_update: { type: DataTypes.INTEGER(11) },
        app_id: { type: DataTypes.INTEGER(5) },
        is_trash: { type: DataTypes.INTEGER(1) },
        client_category: { type: DataTypes.STRING(50) },
        client_background: { type: DataTypes.STRING(255) },
        client_color_theme: { type: DataTypes.STRING(255) },
        client_template: { type: DataTypes.STRING(255) },
        crawljs_keys: { type: DataTypes.STRING(200) },
    }

    const indexes = [
        {
            fields: ['client_name', 'client_status'],
            where: {
                client_status: 1
            }
        }
    ]

    const validFields = Object.keys(scheme)

    class RippleClientModel extends Model {
        static get validFields() {
            return validFields
        }

        static validateFields (fields) {
            return fields.filter(x => this.validFields.indexOf(x) > -1)
        }

        static get operators () {
            return Op
        }
    }

    RippleClientModel.init(scheme, { sequelize: Connection, tableName, indexes })

    return RippleClientModel
}