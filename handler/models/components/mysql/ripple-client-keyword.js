module.exports = function (Connection, { DataTypes, Model, Op }) {
    const tableName = 'ripple_client_keyword'

    const scheme = {
        key_id: { type: DataTypes.INTEGER(11), autoIncrement: true, primaryKey: true },
        key_alert_sms: { type: DataTypes.STRING(200) },
        last_crawl_at: { type: DataTypes.DATEONLY, defaultValue: '1990-01-01' },
        on_crawling: { type: DataTypes.INTEGER(1) },
        status_crawl_facebook: { type: DataTypes.INTEGER(4) },
        status_crawl_linkedin: { type: DataTypes.INTEGER(4) },
        industry_id: { type: DataTypes.INTEGER(11) },
        key_status_recrawl: { type: DataTypes.INTEGER(1) },
        last_alert_sent: { type: DataTypes.DATEONLY, defaultValue: '1990-01-01' },
        keyword_logo: { type: DataTypes.STRING(255) },
        key_email_pic: { type: DataTypes.STRING(100) },
        key_start_date: { type: DataTypes.DATEONLY, defaultValue: '1990-01-01' },
        key_end_date: { type: DataTypes.DATEONLY, defaultValue: '1990-01-01' },
        key_lang: { type: DataTypes.STRING(50) },
        key_client_id: { type: DataTypes.INTEGER(11) },
        key_word: { type: DataTypes.TEXT },
        key_is_cc: { type: DataTypes.INTEGER(1) },
        key_word_in: { type: DataTypes.TEXT },
        key_word_not: { type: DataTypes.TEXT },
        key_desc: { type: DataTypes.STRING(255) },
        key_status: { type: DataTypes.INTEGER(1) },
        time_add: { type: DataTypes.DATE, defaultValue: '1990-01-01' },
        user_add: { type: DataTypes.INTEGER(11) },
        time_update: { type: DataTypes.DATE, defaultValue: '1990-01-01' },
        user_update: { type: DataTypes.INTEGER(11) },
        is_trash: { type: DataTypes.INTEGER(1) },
        key_campaign_id: { type: DataTypes.INTEGER(11) },
        key_brand_id: { type: DataTypes.INTEGER(11) },
        key_stream_status: { type: DataTypes.INTEGER(1) },
        key_positif: { type: DataTypes.TEXT },
        key_negatif: { type: DataTypes.TEXT },
        key_tag: { type: DataTypes.STRING(255) },
        key_name: { type: DataTypes.STRING(100) },
        key_color: { type: DataTypes.STRING(100) },
        key_word_cc_id: { type: DataTypes.STRING(255) },
        key_competitor_cc_id: { type: DataTypes.STRING(255) },
        alert_active: { type: DataTypes.INTEGER(1) },
        email_alert: { type: DataTypes.TEXT },
        phone: { type: DataTypes.STRING(250) },
        increase: { type: DataTypes.INTEGER(11) },
        enable_slide_cc: { type: DataTypes.INTEGER(1) },
        slide_screen_cc: { type: DataTypes.STRING(255) },
        duration_cc: { type: DataTypes.INTEGER(11) },
        enable_email_ig: { type: DataTypes.INTEGER(1) },
        enable_email_ig_competition: { type: DataTypes.INTEGER(1) },
        email_ig: { type: DataTypes.TEXT },
        cc_ig: { type: DataTypes.TEXT },
        bcc_ig: { type: DataTypes.TEXT },
        hour_ig: { type: DataTypes.STRING(5) },
        email_ig_competition: { type: DataTypes.TEXT },
        cc_ig_competition: { type: DataTypes.TEXT },
        bcc_ig_competition: { type: DataTypes.TEXT },
        hour_ig_competition: { type: DataTypes.STRING(5) },
        last_ig_sent: { type: DataTypes.DATEONLY, defaultValue: '1990-01-01' },
        last_ig_sent_competition: { type: DataTypes.DATEONLY, defaultValue: '1990-01-01' },
        buzzer_twitter: { type: DataTypes.TEXT },
        buzzer_fb: { type: DataTypes.TEXT },
        buzzer_ig: { type: DataTypes.TEXT },
        keyword_tracking: { type: DataTypes.TEXT },
        key_type: { type: DataTypes.STRING(20) },
        key_item_keyword: { type: DataTypes.STRING(250) },
        include_bot: { type: DataTypes.INTEGER(1) },
        acc_fb_bot: { type: DataTypes.TEXT },
        acc_twitter_bot: { type: DataTypes.TEXT },
        acc_ig_bot: { type: DataTypes.TEXT },
        key_sociomile_id: { type: DataTypes.INTEGER(11) },
        key_sociomile_token: { type: DataTypes.STRING(250) },
        temporary_token: { type: DataTypes.STRING(100) },
        key_is_buzzer_tracking: { type: DataTypes.INTEGER(1) },
        key_is_health_index: { type: DataTypes.INTEGER(1) },
        key_is_prdashboard: { type: DataTypes.INTEGER(1) },
        alert_sms_active: { type: DataTypes.INTEGER(1) },
        last_alert_sms_sent: { type: DataTypes.DATEONLY, defaultValue: '1990-01-01' },
        key_sentiment_lipi: { type: DataTypes.INTEGER(1) },
        key_users: { type: DataTypes.TEXT },
        last_row_crawl: { type: DataTypes.INTEGER(11) },
    }

    const indexes = [
        {
            fields: ['key_name', 'key_status'],
            where: {
                key_status: 1
            }
        }
    ]

    const validFields = Object.keys(scheme)

    class RippleClientKeywordModel extends Model {
        static get validFields() {
            return validFields
        }

        validateFields (fields) {
            return fields.filter(x => this.validateFields.indexOf(x) > -1)
        }

        static get operators () {
            return Op
        }
    }

    RippleClientKeywordModel.init(scheme, { sequelize: Connection, tableName, indexes })

    return RippleClientKeywordModel
}

