export interface APIResponse<T = string> {
  success: boolean
  message: T
  error?: any
}