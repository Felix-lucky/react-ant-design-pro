import React, { memo,Fragment} from 'react';
import { Row, Col, Card,Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { numberUnit } from '@/utils/utils';
import styles from './style.less';
const pvs=[1,2,3,4,5,6];
const strs=[7,8,9,10,11,12];
const Specification = memo(
    ({loading,moreStatus,parameters,handleClickMore})=>{
        if(parameters===undefined) return false;
        const info=parameters.ACDCInfo;
        return (
            <Card  className={styles.specification} loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
            <Card className={styles.specificationItem}  title={<FormattedMessage id="app.inverter.power-generation" defaultMessage="power-generation" />} bordered={false}>
                <Row type='flex' >
                    {
                        pvs.map(item=>{
                            return (
                                <Col span={4} key={item} className={styles.specificationCol} >
                                    <div className={styles.textSecondary}>PV{item}</div>
                                    <div className={styles.heading}>
                                        {info.Vdc.length<item?'---':`${numberUnit(info.Vdc[item-1])}V/${numberUnit(info.Idc[item-1])}A/${numberUnit(info.Pdc[item-1])}W`}
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
                <Row type='flex'>
                    <Col span={4} className={styles.specificationCol} >
                        <div className={styles.textSecondary}><FormattedMessage id="app.inverter.output-info" /> R</div>
                        <div className={styles.heading}>
                        {`${numberUnit(info.Vac[0])}V/${numberUnit(info.Iac[0])}A/${numberUnit(info.Pac[0])}W`}
                        </div>
                    </Col>
                    <Col span={4} className={styles.specificationCol} >
                        <div className={styles.textSecondary}><FormattedMessage id="app.inverter.output-info" /> S</div>
                        <div className={styles.heading}>
                        {`${numberUnit(info.Vac[1])}V/${numberUnit(info.Iac[1])}A/${numberUnit(info.Pac[1])}W`}
                        </div>
                    </Col>
                    <Col span={4} className={styles.specificationCol} >
                        <div className={styles.textSecondary}><FormattedMessage id="app.inverter.output-info" /> T</div>
                        <div className={styles.heading}>
                        {`${numberUnit(info.Vac[2])}V/${numberUnit(info.Iac[2])}A/${numberUnit(info.Pac[2])}W`}
                        </div>
                    </Col>
                    <Col span={4} className={styles.specificationCol} >
                        <div className={styles.textSecondary}><FormattedMessage id="app.inverter.parameter.temperature" /></div>
                        <div className={styles.heading}>{parameters.Tntc+'℃'}</div>
                    </Col>
                </Row>
                {moreStatus &&
                    (<div>
                        <Row type='flex'>
                            {
                                pvs.map(item=>{
                                    return (
                                        <Col span={4} key={item} className={styles.specificationCol}>
                                            <div className={styles.textSecondary}>String{item}</div>
                                            <div className={styles.heading}>---</div>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                        <Row type='flex'>
                            {
                                strs.map(item=>{
                                    return (
                                        <Col span={4} key={item} className={styles.specificationCol} >
                                            <div className={styles.textSecondary}>String{item}</div>
                                            <div className={styles.heading}>---</div>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </div>)
                }
                <a className={styles.more} onClick={handleClickMore}>
                    <span>{moreStatus?formatMessage({ id: 'app.inverter.pack-up' }):formatMessage({ id: 'app.inverter.more' })}</span>
                    <Icon className={moreStatus? styles.moreIconTrue :styles.moreIconFalse} type="double-right" />
                </a>
            </Card>
            <Card className={styles.specificationItem} title={<FormattedMessage id="app.inverter.electricity" defaultMessage="electricity" />} bordered={false}>
            </Card>
            <Card className={styles.specificationItem} title={<FormattedMessage id="app.inverter.power-grid" defaultMessage="power-grid" />} bordered={false}>
            </Card>
            <Card className={styles.specificationItem} title={<FormattedMessage id="app.inverter.battery" defaultMessage="battery" />} bordered={false}>
            </Card>
        </Card>
        )
    }
);

export default Specification;