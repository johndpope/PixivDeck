// @flow
import * as selectors from '../selectors'
import { initialState } from '../reducer'

const mockStore = {
  LoginModal: {
    ...initialState,
    ...{
      username: 'fakeName',
      password: 'fakePassword',
    },
  },
}

const createMock = s => {
  return {
    LoginModal: {
      ...mockStore,
      ...s,
    },
  }
}

test('makeSelectInfo', () => {
  const getInfo = selectors.makeSelectInfo()
  expect(getInfo(mockStore)).toMatchSnapshot()
})

test('makeSelectIsLoginFailure', () => {
  const s = selectors.makeSelectIsLoginFailure()
  expect(s(mockStore)).toBeFalsy()
})

test('makeSelectIsLoading', () => {
  const s = selectors.makeSelectIsLoading()
  expect(s(mockStore)).toBeFalsy()
})

test('getMyId', () => {
  expect(selectors.getMyId(mockStore)).toBeNull()
  expect(selectors.getMyId(createMock({ account: { id: '1' } }))).toEqual('1')
})
