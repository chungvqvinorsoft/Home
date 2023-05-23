import classNames from "classnames/bind";
import styles from './ServiceControl.module.css';
import PropTypes from 'prop-types';
import AreaChart from "./AreaChart";
import { useCallback, useEffect, useState } from "react";
import axiosClient from "../../../services/axiosClient";
import { array_move } from "../../../utils";
const cx = classNames.bind(styles);

function ServiceControl() {
    const [listService, setListService] = useState([]);

    const getListService = useCallback(async () => {
        const res = await axiosClient.get('/service/get-list-services/');
        const index = res.findIndex(item => item.SUBJECT_NAME === 'Phát hiện đối tượng phổ biến')
        const arr = array_move(res, index, 1)
        const index1 = arr.findIndex(item => item.SUBJECT_NAME === 'Phát hiện camera di chuyển')
        const arr1 = array_move(arr, index1, 2)
        const index2 = arr1.findIndex(item => item.SUBJECT_NAME === 'Phát hiện chuyển động')
        const arr2 = array_move(arr1, index2, 0)
        if (res) {
            setListService(arr2)
        }
    }, [])

    useEffect(() => {
        getListService()
    }, [getListService])

    return (
        <div className={cx('actions-wrapper')}>
            {listService.length > 0 && (
                listService.map((item) => {
                    return (

                        <div className={cx('detect-action')} key={item.CODE}>
                            <AreaChart
                                title={item.SUBJECT_NAME}
                                serviceCode={item.CODE}
                            />
                        </div>

                    )
                })
            )}
        </div>
    )
}

ServiceControl.propTypes = {
    params: PropTypes.any
}

export default ServiceControl; 