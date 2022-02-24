import React, { useContext } from 'react'
import Chirp from './Chirp'
import LoadingFeed from '../Loading/LoadingFeed'
import styles from './ChirpList.module.css'
import AuthContext from '../../context/AuthContext'

const ChirpList = ({ chirps, dispatch, error, isLoading }) => {
    const { state } = useContext(AuthContext)

    if (isLoading) {
        return (
            <div style={{ 'marginTop': '1rem' }}>
                <LoadingFeed height={30} width={30} />
            </div>
        )
    }

    if (!chirps || chirps.length === 0 || error) return <p className={styles['chirps-none']}>No chirps available...</p>

    return (
        <section className={styles.chirps}>
            {chirps.map(({
                _id,
                owner_username,
                content,
                rechirpsCount,
                isRechirped,
                likesCount,
                isLiked,
                createdAt,
                imageURL = null,
                user = null,
                rechirp = null
            }) => {
                let image;
                if(user)image = !rechirp ? user : rechirp.original_image
                return (
                    <Chirp
                        key={_id}
                        id={_id}
                        user={owner_username}
                        message={content}
                        rechirps={rechirpsCount}
                        isChirpRechirped={isRechirped}
                        likes={likesCount}
                        isChirpLiked={isLiked}
                        timestamp={createdAt}
                        rechirp={rechirp}
                        imageURL={imageURL}
                        image={!user ? state.profileImage : image}
                        dispatch={dispatch}
                    />
                )
            })}
        </section>
    )
}

export default ChirpList
