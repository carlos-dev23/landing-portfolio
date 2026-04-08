// src/pages/api/contact.ts
import type { APIRoute } from "astro";

const API_URL = import.meta.env.PUBLIC_API_ROUTE || "http://127.0.0.1:8000";

export const POST: APIRoute = async ({ request }) => {
    const data = await request.json();

    try {
        const response = await fetch(`${API_URL}/api/create/appointments`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + import.meta.env.NOTION_TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        console.log('---- Enviando datos ----');
        console.log(`${API_URL}/api/create/appointments`);
        console.log(response);

        if (!response.ok) {
            const errorFromLaravel = await response.json();
            console.error("Laravel rechazó la petición:", errorFromLaravel);
            if (Object.hasOwn(errorFromLaravel, 'phone')) {
                return new Response(JSON.stringify({ error: "El número de teléfono ya está registrado." }), { status: response.status });
            }
            return new Response(JSON.stringify({ error: errorFromLaravel.message || "Error al registrar en Laravel" }), { status: response.status });
        }

        const successData = await response.json();
        console.log("Respuesta Exitosa de Laravel:", successData);
        return new Response(JSON.stringify(successData), { status: 200 });

    } catch (e) {
        console.error("Fallo grave de red:", e);
        return new Response(JSON.stringify({ error: "El servidor principal está desconectado." }), { status: 500 });
    }
};
