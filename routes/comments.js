const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

router
    .route('/:postId')
    .get(async (req, res) => {
        const { postId } = req.params;

        if (!ObjectId.isValid(postId)) {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        } else {
            const result = await Comment.find({ postId }).sort({createdAt: -1});
            
            res.send(result.map(r => {
                return {
                    commentId: r._id,
                    user: r.user,
                    content: r.content,
                    createdAt: r.createdAt,
                }
            }));
        }
    })
    .post(async (req, res) => {
        const { postId } = req.params;
        const { user, password, content } = req.body;

        if(!content) {
            res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
        } else if(!ObjectId.isValid(postId) || !postId || !user || !password) {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        } else {
            await Comment.create({postId, user, password, content});
      
            res.status(200).json({massage: "댓글을 생성하였습니다."});
        }
    });


router
    .route('/:id')
    .put(async (req, res) => {
        const { id } = req.params;
        const { content, password } = req.body;

        if (!content) res.status(400).json({ message: '댓글 내용을 입력해주세요' });
        else if (!ObjectId.isValid(id) || !password) {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        } else {
            const comment = await Comment.findOne({ _id: id });

            if(!comment) {
                res.status(400).json({ message: '댓글 조회에 실패하였습니다.' });
            } else {
                if(comment.password === password) {
                    await Comment.updateOne({ _id: id, password }, {content});
                    res.status(200).json({ message: "댓글을 수정하였습니다."});
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
        }
        else {
            const comment = await Comment.findOne({ _id: id });

            if(!comment) {
                res.status(400).json({ message: '댓글 조회에 실패하였습니다.' });
            } else {
                if(comment.password === password) {
                    await Comment.deleteOne({ _id: id, password });
                    res.status(200).json({message: "댓글을 삭제하였습니다."});
                } else {
                    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
                }
            }
        }
    });

module.exports = router;