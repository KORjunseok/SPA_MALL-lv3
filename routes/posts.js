const express = require('express');
const router = express.Router();
const Post = require('../schemas/post');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

router
    .route('/')
    .get(async (req, res) => {
        const result = await Post.find({}).sort({ createdAt: -1 });
        res.send(result.map(r => {
            return {
                postId: r._id,
                user: r.user,
                title: r.title,
                createdAt: r.createdAt,
            }
        }));
    })
    .post(async (req, res) => {
        const { user, password, title, content } = req.body; //request 항목 생성 

        if (!user || !password || !title || !content) {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        } else {
            await Post.create({ user, password, title, content });
      
            res.status(200).json({massage: "게시글을 생성하였습니다."});
        }
    });


router
    .route('/:id')
    .get(async (req, res) => {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        } else {
            const result = await Post.findOne({ _id: id });

            if (result) {
                res.send({
                    postId: result._id,
                    user: result.user,
                    title: result.title,
                    content: result.content,
                    createdAt: result.createdAt,
                });
            } else {
                res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
            }
        }
    })
    .put(async (req, res) => {
        const { id } = req.params;
        const { user, content, password, title } = req.body;

        if (!ObjectId.isValid(id) || !user || !password || !title || !content) {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        } else {
            const post = await Post.findOne({ _id: id });

            if(!post) {
                res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
            } else {
                if(post.password === password) {
                    await Post.updateOne({ _id: id }, { user, content, title });
                    res.status(200).json({ message: "게시글을 수정하였습니다."});
                } else {
                    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
                }
            }
        }
    })
    .delete(async (req, res) => {
        const { id } = req.params;
        const { password } = req.body;

        if (!ObjectId.isValid(id) || !password) {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        } else {
            const post = await Post.findOne({ _id: id });

            if(!post) {
                res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
            } else {
                if(post.password === password) {
                    await Post.deleteOne({ _id: id });
                    res.status(200).json({message: "게시글을 삭제하였습니다."});
                } else {
                    res.status(400).json({message: '비밀번호가 일치하지 않습니다.'})
                }
            }
        }
    });

module.exports = router;