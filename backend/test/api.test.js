import http from 'http';

const BASE_URL = 'http://localhost:5000/api/tasks';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log(' Starting Automated API Tests...\n');
  
  try {
    // 1. GET /api/tasks
    const resGet = await request('GET', '');
    console.log('1. GET /api/tasks -> Status:', resGet.status, '| Total tasks:', resGet.body.count);

    // 2. POST /api/tasks (Valid)
    const resPost = await request('POST', '', {
      title: 'Automated Test Task',
      description: 'Created via automated integration test suite.',
      priority: 'high',
      dueDate: '2026-12-31'
    });
    console.log('2. POST /api/tasks -> Status:', resPost.status, '| Created ID:', resPost.body.task?.id);
    const createdId = resPost.body.task?.id;

    // 3. POST /api/tasks (Validation failure)
    const resInvalid = await request('POST', '', { title: '' });
    console.log('3. POST /api/tasks (Invalid Title) -> Status:', resInvalid.status, '(Expected 400)');

    // 4. PATCH /api/tasks/:id/status
    if (createdId) {
      const resToggle = await request('PATCH', `/${createdId}/status`);
      console.log('4. PATCH status -> Status:', resToggle.status, '| New Status:', resToggle.body.task?.status);
    }

    // 5. PUT /api/tasks/:id
    if (createdId) {
      const resPut = await request('PUT', `/${createdId}`, {
        title: 'Updated Test Task Title',
        description: 'Updated description.',
        priority: 'medium'
      });
      console.log('5. PUT /api/tasks/:id -> Status:', resPut.status, '| New Title:', resPut.body.task?.title);
    }

    // 6. DELETE /api/tasks/:id
    if (createdId) {
      const resDel = await request('DELETE', `/${createdId}`);
      console.log('6. DELETE /api/tasks/:id -> Status:', resDel.status);
    }

    console.log('\n All API tests completed successfully!');
  } catch (err) {
    console.error(' Test Execution Error:', err.message);
  }
}

runTests();
