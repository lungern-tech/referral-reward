export const upload = (file: File, name: string) => {
  let formData = new FormData();
  formData.append('file', file)
  formData.append('name', name)
  return fetch('/api/file/upload', {
    method: 'POST',
    body: formData,
  }).then<{ filename: string }>(res => res.json())
}