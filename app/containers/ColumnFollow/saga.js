// @flow
import union from 'lodash/union'
import { addColumn } from 'containers/ColumnManager/actions'
import { makeSelectInfo } from 'containers/LoginModal/selectors'
import { getRequest, fetchAuth } from '../../api/client'
import * as Actions from './constants'
import * as actions from './actions'
import type { ColumnId } from './reducer'
import { makeSelectColumn, makeSelectIds } from './selectors'
import { put, select, call, takeEvery } from 'redux-saga/effects'

function* addFollowColumn({ id }: { id: ColumnId }) {
  const ids: Array<?ColumnId> = yield select(makeSelectIds())
  if (ids.every(v => v !== id)) {
    yield put(actions.addFollowColumnSuccess(id))
  }

  yield put(addColumn(`follow-${id}`, { columnId: id, type: 'FOLLOW' }))
}

type Props = { id: ColumnId }

function* fetchFollow(props: Props) {
  const { id } = props
  const { illustIds } = yield select(makeSelectColumn(), props)

  try {
    const info = yield select(makeSelectInfo())
    // TODO
    const { accessToken, user: { id: userId } } = yield call(fetchAuth, info)

    const response = yield call(
      getRequest,
      `/v2/illust/follow?user_id=${userId}&restrict=${id}`,
      null,
      accessToken
    )
    const { result } = response

    yield put(actions.setNextUrl(id, result.nextUrl))

    const nextIds = union(illustIds, result.illusts)
    yield put(actions.fetchFollowSuccess(id, response, nextIds))
  } catch (err) {
    yield put(actions.fetchFollowFailre(id))
  }
}

function* fetchNextFollow(props: Props) {
  const { id } = props
  const { illustIds, nextUrl } = yield select(makeSelectColumn(), props)

  try {
    if (!nextUrl) {
      return
    }

    const info = yield select(makeSelectInfo())
    const { accessToken } = yield call(fetchAuth, info)

    const response = yield call(getRequest, nextUrl, null, accessToken)
    const { result } = response

    yield put(actions.setNextUrl(id, result.nextUrl))

    const nextIds = union(illustIds, result.illusts)
    yield put(actions.fetchFollowSuccess(id, response, nextIds))
  } catch (err) {
    yield put(actions.fetchNextFollowFailre(id))
  }
}

export default function* root(): Generator<*, void, void> {
  yield takeEvery(Actions.ADD_FOLLOW_COLUMN, addFollowColumn)
  yield takeEvery(Actions.FETCH_FOLLOW, fetchFollow)
  yield takeEvery(Actions.FETCH_NEXT_FOLLOW, fetchNextFollow)
}