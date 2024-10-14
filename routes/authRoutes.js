const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
});

// GitHub Auth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router;
