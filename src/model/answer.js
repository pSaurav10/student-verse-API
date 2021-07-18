const mongoose = require('mongoose');
const schema = mongoose.schema;

const voteSchema = require('./vote');
const commentSchema = require('./comment');

const answerSchema = new schema({
    author: {
        type: schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {type: Date, default: Date.now},
    text:{type: String, required: true},
    comment:[commentSchema],
    votes:[voteSchema],
    score: {type: Number, default: 0}
});

answerSchema.methods = {
    vote: function (user, vote) {
        const existingVote = this.votes.find((v)=> v.user._id.equals(user));

        if(existingVote){
            this.score -= exitstingVote.vote;
            if (vote == 0){
                this.votes.pull(existingVote);
            }
            else{
                this.score += vote;
                existingVote.vote = vote;
            }
        }
        else if (vote !== 0){
            this.score += vote;
            this.votes.push({user, vote});
        }
        return this;
    },

addComment: function (author, body){
    this.comment.push({ author, body});
    return this;
},

removeComment: function(id){
    const comment = this.comments.id(id);
    if (!comment) throw new Error('Comment Not Found');
    comment.remove();
    return this;
},
};


module.exports = mongoose.model('Answer', answerSchema)