import React from 'react'
import { NavLink } from 'react-router-dom'
import Icon from '../UI/Icon/Icon';

const MenuItem = (props) => {
    return (
        <div className={props.className}>
            <NavLink
                to={props.link}
                end={true}
                children={({ isActive }) => {
                    return (
                        <>
                            <Icon
                                width='28px'
                                height='28px'
                                fill='white'
                                d={props.d || (isActive ? props.active : props.inactive)} />
                            {props.label && <span>{`${props.label}`}</span>}
                        </>
                    )
                }} />
        </div>
    )
}

export default MenuItem