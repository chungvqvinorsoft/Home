import classNames from "classnames/bind";
import styles from './DougNutChart.module.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import axiosClient from "../../../../services/axiosClient";

const cx = classNames.bind(styles)
ChartJS.register(ArcElement, Tooltip, Legend);

let color = [
    '#141ED2',
    '#925FFF',
    '#EC427F',
    '#FFC369',
]

function DougNutChart({ label, type }) {
    const [bgColor, setBgColor] = useState(color)
    const [dataCamera, setDataCamera] = useState({ name: [], count: [] })

    useEffect(() => {
        const getAndUpDateDataForChart = async () => {
            const getData = await axiosClient.get(`/statPositionCam/get-list-stat-position-cam/?type=${type}`)
            if (type === 'group') {
                const name = getData?.map((item) => {
                    return item.GROUP_NAME
                })
                const count = getData?.map((item) => {
                    return item.COUNT
                })
                setDataCamera({ name: name, count: count })
                const upDateData = await axiosClient.post('/statPositionCam/post-add-stat-position-cam/')
                return upDateData;
            }
            if (type === 'warehouse') {
                const name = getData.map((item) => {
                    return item.WAREHOUSE_NAME
                })
                const count = getData?.map((item) => {
                    return item.COUNT
                })
                setDataCamera({ name: name, count: count })
            }
        }
        getAndUpDateDataForChart()
    }, [type])

    function randomHexColor() {
        let hexColor = "#";
        for (let i = 0; i < 6; i++) {
            hexColor += Math.floor(Math.random() * 16).toString(16);
        }
        return hexColor;
    }


    useEffect(() => {
        if (dataCamera.name.length > bgColor.length) {
            for (let i = 0; i < dataCamera.name.length - bgColor.length; i++) {
                const newColor = randomHexColor()
                setBgColor(prev => [...prev, newColor])
            }
        }
    }, [dataCamera, bgColor])
    const data = {
        labels: dataCamera.name,
        datasets: [
            {
                label: 'Camera',
                data: dataCamera.count,
                backgroundColor: bgColor,
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                display: false
            }
        }
    }
    return (
        <>
            <h2 className={cx('header')}>{label}</h2>
            <div className={cx('chart-container')}>
                <div className={cx('chart')}>
                    <Doughnut data={data} options={options} />
                    <div className={cx('legend')}>
                        {data.labels.map((item, index) => {
                            return (
                                <div className={cx('legend-item')} key={index}>
                                    <span className={cx('color')} style={{ background: `${data.datasets[0].backgroundColor[index]}` }}></span>
                                    <div className={cx('name-group')}>{item}</div>
                                    <div className={cx('number-camera')}>{data.datasets[0].data[index]}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

DougNutChart.propTypes = {
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
}

export default DougNutChart;