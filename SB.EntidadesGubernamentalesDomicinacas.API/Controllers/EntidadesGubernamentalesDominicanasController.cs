using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using static System.Net.Mime.MediaTypeNames;
using SB.EntidadesGubernamentalesDomicinacas.API.Models;
using System.Linq;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Serilog;
using Microsoft.AspNetCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SB.EntidadesGubernamentalesDomicinacas.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class EntidadesGubernamentalesDominicanasController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string _rutaArchivo;
        List<EntidadesGubernamentalesDomicinacasModel> listaEntidades = new List<EntidadesGubernamentalesDomicinacasModel>();

        public EntidadesGubernamentalesDominicanasController(IConfiguration configuration)
        {
            _configuration = configuration;
            _rutaArchivo = Path.Combine(Directory.GetCurrentDirectory(), _configuration["conexion_archivo:ruta"]);
        }


        // GET api/<EntidadesGubernamentalesDomicinacas>/5
        [HttpGet]
        [Authorize]
        [Route("ConsultarListaEntidades")]
        public async Task<IActionResult> ConsultarListaEntidades()
        {

            try
            {
                string json = "";

                await Task.Run(() =>
                {
                    string[] lineas = System.IO.File.ReadAllLines(_rutaArchivo);

                    foreach (string linea in lineas)
                    {
                        string[] partes = linea.Split('|');
                        if (partes.Length >= 2)
                        {
                            listaEntidades.Add(new EntidadesGubernamentalesDomicinacasModel
                            {
                                IdEntidad = partes[0].Trim(),
                                NombreEntidad = partes[1].Trim()
                            });
                        }
                    }
                    json = JsonConvert.SerializeObject(listaEntidades);


                });

                return Ok(json);
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return Ok(new { mensaje = ex.Message });

            }
        }

        // POST api/<EntidadesGubernamentalesDomicinacas>
        [HttpPost]
        [Authorize]
        [Route("RegistrarEntidad")]

        public async Task<IActionResult> RegistrarEntidad([FromBody] EntidadesGubernamentalesDomicinacasModel entidad)
        {
            try
            {
                await Task.Run(() =>
                {

                    string nombreEntidad = entidad.NombreEntidad;

                    using (StreamWriter escribir = new StreamWriter(_rutaArchivo, true))
                    {
                        escribir.WriteLine(entidad.IdEntidad + "|" + nombreEntidad);
                    }

                });

                return Ok(new { mensaje = "Registro exitoso" });

            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return Ok(new { mensaje = ex.Message });

            }
        }

        // PUT api/<EntidadesGubernamentalesDomicinacas>/5
        [HttpPut]
        [Authorize]
        [Route("ActualizarNombreEntidad")]
        public async Task<IActionResult> ActualizarNombreEntidad([FromBody] EntidadesGubernamentalesDomicinacasModel entidad)
        {
            try
            {
                await Task.Run(() =>
                {

                    string[] lineas = System.IO.File.ReadAllLines(_rutaArchivo);

                    using (StreamWriter escribir = new StreamWriter(_rutaArchivo))
                    {
                        foreach (string linea in lineas)
                        {
                            string[] partes = linea.Split('|');
                            if (partes.Length >= 2)
                            {
                                string nuevaLinea = linea.Contains(entidad.IdEntidad) ? linea.Replace(partes[1], entidad.NombreEntidad) : linea;
                                escribir.WriteLine(nuevaLinea);
                            }
                        }
                    }

                });

                return Ok(new { mensaje = "Actualizacion exitosa" });

            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return Ok(new { mensaje = ex.Message });

            }

        }
        // DELETE api/<EntidadesGubernamentalesDomicinacas>/5
        [HttpDelete]
        [Authorize]
        [Route("BorrarEntidad")]
        public async Task<IActionResult> BorrarEntidad([FromBody] EntidadesGubernamentalesDomicinacasModel entidad)
        {
            try
            {
                await Task.Run(() =>
                {

                    string[] lineas = System.IO.File.ReadAllLines(_rutaArchivo);

                    using (StreamWriter escribir = new StreamWriter(_rutaArchivo))
                    {
                        foreach (string linea in lineas)
                        {
                            string[] partes = linea.Split('|');
                            if (partes.Length >= 2)
                            {
                                string nuevaLinea = linea.Contains(entidad.IdEntidad) ? linea.Replace(linea, string.Empty) : linea;
                                escribir.WriteLine(nuevaLinea);

                            }
                        }
                    }

                });

                return Ok(new { mensaje = "Borrado exitoso" });

            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return Ok(new
                {
                    mensaje = ex.Message
                });

            }
        }


        [HttpPost]
        [Route("GenerarJwtToken")]
        public async Task<IActionResult> GenerarJwtToken([FromBody] Usuario usuario)
        {
            try
            {
                Log.Information("\"Nombre usuario solicito token:" + usuario.NombreUsuario);
                JwtSecurityToken jwtConfig = new JwtSecurityToken();

                if (usuario.NombreUsuario == _configuration["Usuario:nombre"] && usuario.Clave == _configuration["Usuario:clave"])
                {

                    await Task.Run(() =>
                    {

                        var userClaim = new[]
                        {
                new Claim(ClaimTypes.NameIdentifier,usuario.NombreUsuario)
                };

                        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:key"]!));
                        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

                        //crear detalle del token
                        jwtConfig = new JwtSecurityToken(
                            expires: DateTime.UtcNow.AddMinutes(15),
                            claims: userClaim,
                            signingCredentials: credentials
                            );

                    });

                    return Ok(new { mensaje = "Token generando exitosamente. Ahora puede consultar y crear registros!", token = new JwtSecurityTokenHandler().WriteToken(jwtConfig) });
                }
                else
                    return Ok(new { mensaje = "Usuario o clave incorectos" });
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return Ok(new
                {
                    mensaje = ex.Message
                });

            }
        }
    }
}
