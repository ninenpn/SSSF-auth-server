import express from 'express';
import {
  //check,
  // checkToken,
  userDelete,
  userDeleteCurrent,
  userGet,
  userListGet,
  userPost,
  userPut,
  userPutCurrent,
} from '../controllers/userController';
import {authenticate} from '../../middlewares';

const router = express.Router();

router
  .route('/')
  .get(userListGet)
  .post(userPost)
  .put(authenticate, userPutCurrent)
  .delete(authenticate, userDeleteCurrent);

//router.get('/token', authenticate, checkToken);

// router.route('/check').get(check);

router
  .route('/:id')
  .get(userGet)
  .put(authenticate, userPut)
  .delete(authenticate, userDelete);

// router.get('/token', authenticate, checkToken);

// router.route('/check').get(check);

export default router;
