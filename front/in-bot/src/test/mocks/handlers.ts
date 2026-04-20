import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('*/auth/login', () => {
    return HttpResponse.json({
      access_token: 'fake-jwt-token',
    });
  }),

  http.post('*/auth/register', () => {
    return new HttpResponse(null, { status: 201 });
  }),
  
  http.get('*/address/cep/:cep', ({ params }) => {
    const { cep } = params;
    if (cep === '01001-000' || cep === '01001000') {
      return HttpResponse.json({
        cep: '01001-000',
        street: 'Praça da Sé',
        neighborhood: 'Sé',
        city: 'São Paulo',
        state: 'SP',
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.get('*/contacts', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(11) 99999-9999',
        address: {
          cep: '01001-000',
          street: 'Praça da Sé',
          neighborhood: 'Sé',
          city: 'São Paulo',
          state: 'SP',
          number: 100,
        },
      },
    ]);
  }),

  http.post('*/contacts', () => {
    return new HttpResponse(null, { status: 201 });
  }),

  http.put('*/contacts/:id', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.delete('*/contacts/:id', () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
