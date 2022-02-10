import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import ChirpIcons from './ChirpIcons'
import { date } from '../../helpers/date'
import MainContext from '../../context/MainContext'
import classes from './Chirp.module.css'

const Chirp = ({ id, user, message, comments, rechirps, isChirpRechirped, likes, isChirpLiked, timestamp, rechirp, onDelete, onRechirp, onSyncFeed }) => {

    const ctx = useContext(MainContext)
    const [likesCount, setLikesCount] = useState(likes)
    const [rechirpsCount, setRechirpsCount] = useState(rechirps)

    const onLikeButtonHandler = async () => {
        if (!isChirpLiked) {
            try {
                const req = !rechirp ? id : rechirp.original_id
                const response = await fetch("http://localhost:3001/users/like", {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.jwt}`
                    },
                    body: JSON.stringify({ _id: req })
                })
                const { likedChirps, retweetedChirps } = await response.json()
                setLikesCount(prev => prev + 1)
                onSyncFeed(likedChirps, retweetedChirps)
            } catch (e) {
                console.log(e.message)
            }
        } else {
            try {
                const req = !rechirp ? id : rechirp.original_id
                const response = await fetch("http://localhost:3001/users/unlike", {
                    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.jwt}`
                    },
                    body: JSON.stringify({ _id: req })
                })
                const { likedChirps, retweetedChirps } = await response.json()
                setLikesCount(prev => prev - 1)
                onSyncFeed(likedChirps, retweetedChirps)
            } catch (e) {
                console.log(e.message)
            }
        }
    }

    const onRechirpButtonHandler = async () => {
        if (!isChirpRechirped) {
            try {
                const req = !rechirp ? {
                    content: message,
                    rechirp: {
                        original_id: id,
                        original_owner: user,
                        original_time: timestamp
                    }
                } : {
                    content: message,
                    rechirp: {
                        original_id: rechirp.original_id,
                        original_owner: rechirp.original_owner,
                        original_time: rechirp.original_time
                    }
                }
                const response = await fetch("http://localhost:3001/chirps/rechirp", {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.jwt}`
                    },
                    body: JSON.stringify(req)
                })
                const { chirp, likedChirps, retweetedChirps } = await response.json()
                onRechirp({
                    ...chirp,
                    username: ctx.user,
                    isLiked: isChirpLiked,
                    isRechirped: true
                })
                setRechirpsCount(prev => prev + 1)
                onSyncFeed(likedChirps, retweetedChirps)
            } catch (e) {
                console.log(e.message)
            }
        } else {
            try {
                const req = !rechirp ? id : rechirp.original_id
                if (!rechirp) {
                    const response = await fetch("http://localhost:3001/chirps/rechirp/delete", {
                        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.jwt}`
                        },
                        body: JSON.stringify({ _id: req })
                    })
                    const { likedChirps, retweetedChirps } = await response.json()
                    onSyncFeed(likedChirps, retweetedChirps)
                } else {
                    const response = await fetch("http://localhost:3001/chirps/rechirp/delete", {
                        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.jwt}`
                        },
                        body: JSON.stringify({ _id: req })
                    })
                    const { likedChirps, retweetedChirps } = await response.json()
                    onSyncFeed(likedChirps, retweetedChirps)
                }
                setRechirpsCount(prev => prev - 1)
                onDelete(req)
            } catch (e) {
                console.log(e.message)
            }
        }
    }

    const testHandler = () => {
        console.log('test')
    }

    const post_owner = rechirp ? rechirp.original_owner : user
    const post_id = rechirp ? rechirp.original_id : id
    const post_time = rechirp ? rechirp.original_time : timestamp

    return (
        <>
            {rechirp && <span>Is rechirped by {`${user}`}</span>}
            <article className={classes['chirp']} key={id}>
                <Link to={`/${post_owner}`} className={classes['chirp__icon']} />
                <div className={classes['chirp__main']}>
                    <section className={classes['chirp__main-header']}>
                        <Link to={`/${post_owner}`} className={classes['chirp__main-user']}>{post_owner}</Link>
                        <span>·</span>
                        <Link to={`/${post_owner}/status/${post_id}`} className={classes['chirp__main-timestamp']}>{date(post_time)}</Link>
                    </section>
                    <section>
                        <Link to={`/${post_owner}/status/${post_id}`} className={classes['chirp__main-message']}>
                            <p>{message}</p>
                        </Link>
                    </section>
                    <section className={classes['chirp__main-actions']}>
                        <ChirpIcons stats={
                            [
                                { count: comments, active: false, onClick: testHandler },
                                { count: rechirpsCount, active: isChirpRechirped, onClick: onRechirpButtonHandler },
                                { count: likesCount, active: isChirpLiked, onClick: onLikeButtonHandler }
                            ]
                        } />
                    </section>
                </div>
            </article>
        </>
    )
}

export default Chirp
