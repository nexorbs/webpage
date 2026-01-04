export function simulateAdmin(power: boolean): void {
  if (import.meta.env.MODE !== 'production') {
    if (power) {
      localStorage.setItem('theme', 'dark')
      localStorage.setItem(
        'nexorbs_auth_token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNGU1ZjZnN2g4IiwiYWNjb3VudElkIjoiYWRtaW4tYTFiMmMzZDQiLCJkaXNwbGF5TmFtZSI6IkFkbWluIE5leE9yYnMiLCJlbWFpbCI6ImFkbWluQG5leG9yYnMuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY3MDg0NjY4LCJleHAiOjE3NjcxNzEwNjh9.ENfn4t+U0W23QgCBidNBGmCQ4bh+4MOseNJGtz/C6t4=',
      )
      localStorage.setItem(
        'nexorbs_user_data',
        '{"id":"a1b2c3d4e5f6g7h8","account_id":"admin-a1b2c3d4","display_name":"Admin NexOrbs","email":"admin@nexorbs.com","role":"admin","avatar_url":null}',
      )
      const event = new CustomEvent('authChanged', {
        detail: {
          isLoggedIn: true,
          user: JSON.parse(
            '{"id":"a1b2c3d4e5f6g7h8","account_id":"admin-a1b2c3d4","display_name":"Admin NexOrbs","email":"admin@nexorbs.com","role":"admin","avatar_url":null}',
          ),
        },
      })
      window.dispatchEvent(event)
    } else {
      localStorage.removeItem('nexorbs_auth_token')
      localStorage.removeItem('nexorbs_user_data')
      const event = new CustomEvent('authChanged', {
        detail: {
          isLoggedIn: false,
          user: null,
        },
      })
      window.dispatchEvent(event)
    }
  }
}
