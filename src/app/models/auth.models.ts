import { User } from './user.models'

export interface Auth extends User {
  token: string
}
