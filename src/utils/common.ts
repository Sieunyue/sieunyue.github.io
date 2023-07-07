import path from "path"

export const getPublicDir = () => {
  return path.join(process.cwd(), '/public')
}

export const sleep = (delay = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), delay)
  })
}