import React, { useState } from 'react'
import { newChirpRequest } from '../../actions/chirps'
import ChirpInput from '../UI/ChirpInput/ChirpInput'
import ProfileImage from '../UI/ProfileImage/ProfileImage'
import styles from './NewChirp.module.css'

const NewChirp = (props) => {
    const [textInput, setTextInput] = useState('')
    const textChangeHandler = (e) => setTextInput(e.target.value)
    const resetTextHandler = () => setTextInput('')

    const onSubmitChirpHandler = (e) => {
        e.preventDefault()
        if (textInput.trim().length > 0) newChirpRequest(textInput, props.onNewChirp, props.isModal, props.onClose)
        resetTextHandler()
    }

    const newChirpClass = props.className
        ? `${props.className} ${styles['new-chirp']}`
        : styles['new-chirp']

    return (
        <section className={newChirpClass}>
            <ProfileImage
                className={styles['new-chirp__icon']}
                default={true}
            />
            <ChirpInput
                onSubmit={onSubmitChirpHandler}
                text={textInput}
                onChange={textChangeHandler}
            />
        </section>
    )
}

export default NewChirp
