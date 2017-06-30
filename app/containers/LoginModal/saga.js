// @flow
// eslint-disable-next-line import/order
import { put, call, takeEvery } from 'redux-saga/effects'
import { fetchAuth } from '../../api/client'
import { openModal, closeModal } from '../ModalManeger/actions'
import { loginFailure, endLoading, clearError, setAuth } from './actions'
import * as Actions from './constants'

function* authorize({ username, password }): Generator<*, void, *> {
  // エラーを非表示
  yield put(clearError())
  try {
    yield call(fetchAuth, { username, password })
    yield put(setAuth(username, password))
    yield put(closeModal())
  } catch (err) {
    yield put(loginFailure())
  } finally {
    yield put(endLoading())
  }
}

function* logout() {
  yield put(endLoading())
  // ログインモーダルを表示
  yield put(openModal('Login'))
}

function* root(): Generator<*, void, void> {
  yield takeEvery(Actions.LOGIN_REQUEST, authorize)
  yield takeEvery(Actions.LOGOUT, logout)
}

export default root