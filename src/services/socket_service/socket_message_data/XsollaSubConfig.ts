import {XsollaSubPeriod} from "./xsolla_sub_config/XsollaSubPeriod";


export type XsollaSubConfig = {
    id: number,
    external_id: string,
    group_id: string | null,
    project_id: number,
    name: {
        en: string
    },
    description: {
        en: string
    },
    localized_name: string,
    charge: {
        period: XsollaSubPeriod,
        amount: number,
        currency: string
    },
    expiration: XsollaSubPeriod,
    trial: XsollaSubPeriod,
    grace_period: XsollaSubPeriod,
    billing_retry: {
        value: number
    },
    type: string,
    status: {
        value: string,
        counters: {
            active: number,
            canceled: string,
            non_renewing: number,
            frozen: number
        }
    },
    remind_days_before_charge: number,
    remind_days_before_notify: number,
    refund_period: null,
    tags: null,
    active_period: {
        date_start: null,
        date_null: null
    },
    recurrent_bonus: null
}