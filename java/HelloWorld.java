import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class HelloWorld extends HttpServlet
{
   public void doGet(HttpServletRequest   req,
                     HttpServletResponse  res)
   throws ServletException, IOException
   {
    res.setContentType("text/html");
    PrintWriter out = res.getWriter();

    out.println("<html>");
    out.println("<head><title>Hello World</title></head>");
    out.println("<body>");
    out.println("Hello World");
    out.println("</body>");
    out.println("</html>");
   }
}
