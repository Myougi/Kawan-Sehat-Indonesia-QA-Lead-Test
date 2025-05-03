import { test, expect, request } from '@playwright/test';

const API_URL = 'https://api.infokes.id/v1/postPendaftaran';

test.describe('Infokes API', () => {

    test('[API-001] Submit request pendaftaran dengan valid data', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "3275022107940015",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(200);
    });

    test('[API-002] Submit request tanpa header username', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "3275022107940015",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(401);
    });

    test('[API-003] Submit request dengan invalid token', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "invalid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "3275022107940015",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(401);
    });

    test('[API-004] Submit request dengan mengosongkan nama', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "",
                nik: "3275022107940015",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Nama tidak boleh kosong');
    });

    test('[API-005] Submit request dengan mengosongkan nik', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'NIK tidak boleh kosong');
    });

    test('[API-006] Submit request dengan nik > 16 angka', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "3275022107940015001",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'NIK tidak boleh lebih dari 16 angka');
    });

    test('[API-007] Submit request dengan tanpa asuransi (Asumsi jika ada pilihan tidak ingin menggunakan asuransi)', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "32750221079400",
                asuransi: "",
                no_asuransi: "",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Berhasil submit request pendaftaran');
    });

    test('[API-008] Submit request dengan asuransi (Asumsi jika ada pilihan ingin menggunakan asuransi)', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "32750221079400",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Berhasil submit request pendaftaran');
    });

    test('[API-009] Submit request dengan nomor asuransi kosong jika menggunakan asuransi', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "32750221079400",
                asuransi: "AXA MANDIRI",
                no_asuransi: "",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Nomor Asuransi Wajib Diisi');
    });

    test('[API-010] Submit request dengan invalid nomor asuransi jika menggunakan asuransi', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "32750221079400",
                asuransi: "AXA MANDIRI",
                no_asuransi: "5765",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Nomor Asuransi Tidak Ditemukan');
    });

    test('[API-011] Submit request dengan kodepoli kosong', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "32750221079400",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Kodepoli wajib diisi');
    });

    test('[API-012] Submit request dengan invalid kodepoli (Asumsi pilihan kodepoli psikolog tidak ada dirumah sakit terdaftar)', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "32750221079400",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "PSIKOLOG",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Kodepoli tidak ditemukan');
    });

    test('[API-013] Submit request dengan tanpa input tanggal periksa', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "32750221079400",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "UMUM",
                tanggalperiksa: "",
            },
        });
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Tanggal Periksa wajib diisi');
    });

    test('[API-014] Submit request dengan mengirimkan format salah tanggal periksa', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "32750221079400",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "UMUM",
                tanggalperiksa: "05-31-2025",
            },
        });
        
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Invalid format tanggal periksa');
    });

    test('[API-015] Submit request dengan body format form-data', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            form: {
                nama: "MOHAMMAD YOGI",
                nik: "32750221079400",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02"
            },
        });
        
        expect(response.status()).toBe(415);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Unsupported Media Type');
    });

    test('[API-016] Submit request dengan menambahkan parameter yang ada di body', async ({ request }) => {
        const response = await request.post(`${API_URL}?nama="MOHAMMAD YOGI"&nik="32750221079400"&asuransi="AXA MANDIRI"&no_asuransi="123"&kodepoli="UMUM"&tanggalperiksa="2025-05-02"`);
        
        expect(response.status()).toBe(404);
    });

    test('[API-017] Submit request dengan maximal time dibawah 2 detik', async ({ request }) => {
        const start = Date.now();
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "3275022107940015",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                kodepoli: "UMUM",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(200);

        const duration = Date.now() - start;
        expect(duration).toBeLessThan(2000);
    });

    test('[API-018] Submit request dengan invalid body', async ({ request }) => {
        const response = await request.post(API_URL, {
            headers: {
                'x-username': "valid_username",
                'x-token': "valid_token",
                'Content-Type': 'application/json'
            },
            data: {
                nama: "MOHAMMAD YOGI",
                nik: "3275022107940015",
                asuransi: "AXA MANDIRI",
                no_asuransi: "123",
                tanggalperiksa: "2025-05-02",
            },
        });
        
        expect(response.status()).toBe(400);
    });
});