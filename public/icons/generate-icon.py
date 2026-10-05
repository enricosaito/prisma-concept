import math
def sub(a,b): return (a[0]-b[0],a[1]-b[1])
def add(a,b): return (a[0]+b[0],a[1]+b[1])
def mul(a,k): return (a[0]*k,a[1]*k)
def norm(a): l=math.hypot(*a); return (a[0]/l,a[1]/l)
def inter(p,d,q,e):
    den=d[0]*e[1]-d[1]*e[0]; t=((q[0]-p[0])*e[1]-(q[1]-p[1])*e[0])/den; return add(p,mul(d,t))
def geom(t=120,s=46,b=40,w=(12,3,9,3),swell=(4,0,3,0),hair=3,slit0=1.6,slit1=4,rb=9,hy=6,tail=True,**_):
    V=[(0,t),(-s,0),(0,-b),(s,0)]  # T L B R
    c=(0,(t-b)/3)
    lines=[]
    for i in range(4):
        a,bp=V[i],V[(i+1)%4]; d=norm(sub(bp,a)); n=(-d[1],d[0])
        if (sub(c,a)[0]*n[0]+sub(c,a)[1]*n[1])<0: n=mul(n,-1)
        lines.append((add(a,mul(n,w[i])),d,n))
    I=[inter(lines[i-1][0],lines[i-1][1],lines[i][0],lines[i][1]) for i in range(4)]  # inner corner at vertex i
    return V,I,lines
def paths(**k):
    V,I,lines=geom(**k)
    sw=k.get('swell',(4,0,3,0))
    f=lambda p:f"{p[0]:.2f} {p[1]:.2f}"
    outer="M"+"L".join(f(p) for p in V)+"Z"
    # inner counter reversed direction (evenodd anyway), with Q swells
    seg=[]
    inner="M"+f(I[0])
    for i in range(4):
        a,bp=I[i],I[(i+1)%4]
        if sw[i]:
            m=mul(add(a,bp),.5); n=lines[i][2]; cp=add(m,mul(n,2*sw[i]))
            inner+="Q"+f(cp)+" "+f(bp)
        else: inner+="L"+f(bp)
    inner+="Z"
    return outer,inner,V,I
def slit(t=120,b=40,hy=6,rb=9,slit0=1.4,slit1=4,hair=3,**_):
    # tapered from tip to ball, then hairline to back
    h0,h1,h2=slit0/2,slit1/2,hair/2
    d=f"M{-h0} {t}L{-h1} {hy}L{h1} {hy}L{h0} {t}Z M{-h2} {hy}L{-h2} {-b}L{h2} {-b}L{h2} {hy}Z"
    return d

def paths2(bow=(0,0,0,0),**k):
    V,I,lines=geom(**k)
    sw=k.get('swell',(4,0,3,0))
    f=lambda p:f"{p[0]:.2f} {p[1]:.2f}"
    outer="M"+f(V[0])
    for i in range(4):
        a,bp=V[i],V[(i+1)%4]
        if bow[i]:
            n=lines[i][2]; cp=add(mul(add(a,bp),.5),mul(n,-2*bow[i])); outer+="Q"+f(cp)+" "+f(bp)
        else: outer+="L"+f(bp)
    outer+="Z"
    inner="M"+f(I[0])
    for i in range(4):
        a,bp=I[i],I[(i+1)%4]; n=lines[i][2]
        off=2*sw[i]-2*bow[i]
        if off: inner+="Q"+f(add(mul(add(a,bp),.5),mul(n,off)))+" "+f(bp)
        else: inner+="L"+f(bp)
    inner+="Z"
    return outer,inner
def drop(t=120,b=40,hy=6,rb=9,hair=2.5,theta=50,lead=22,**_):
    h=hair/2;r=rb;th=math.radians(theta)
    P=(-r*math.sin(th),hy+r*math.cos(th))
    u=(-h+r*math.sin(th))/math.cos(th)
    yc=P[1]+u*math.sin(th)
    ys=yc+lead
    f=lambda x,y:f"{x:.2f} {y:.2f}"
    d=(f"M{f(-h,t)}L{f(-h,ys)}Q{f(-h,yc)} {f(*P)}"
       f"A{r} {r} 0 1 1 {f(-P[0],P[1])}"
       f"Q{f(h,yc)} {f(h,ys)}L{f(h,t)}Z")
    d+=f"M{f(-h,hy)}L{f(-h,-b)}L{f(h,-b)}L{f(h,hy)}Z"
    return d

def tear(hy=6,rb=9,reach=50,theta=50,**_):
    # pure teardrop: ball at hy, tapering to a sharp point 'reach' units toward the tip (+y)
    r=rb;th=math.radians(theta)
    P=(-r*math.sin(th),hy+r*math.cos(th));tip=(0,hy+r+reach)
    # control on tangent at P, meeting the axis-near line
    u=(r*math.sin(th))/math.cos(th)*0.85
    C=(P[0]+u*math.cos(th)*0.0, P[1]+u*math.sin(th)+reach*0.45)
    f=lambda x,y:f"{x:.2f} {y:.2f}"
    return (f"M{f(*tip)}Q{f(C[0],C[1])} {f(*P)}A{r} {r} 0 1 1 {f(-P[0],P[1])}Q{f(-C[0],C[1])} {f(*tip)}Z")

def tear2(hy=6,rb=9,reach=40,pinch=0.12,belly=1.0,**_):
    r=rb;ty=hy+r+reach
    f=lambda x,y:f"{x:.2f} {y:.2f}"
    return (f"M{f(0,ty)}C{f(-r*pinch,ty-reach*0.45)} {f(-r,hy+r*belly)} {f(-r,hy)}"
            f"A{r} {r} 0 0 1 {f(r,hy)}C{f(r,hy+r*belly)} {f(r*pinch,ty-reach*0.45)} {f(0,ty)}Z")

def ballline(t=120,hy=6,rb=9,lw0=2.6,lw1=0.6,curve=6,end=4,**_):
    # ball at (0,hy); fine tapered line from the ball to near the tip, bowing like the concave left flank
    r=rb;p0=(0,hy);p2=(0,t-end);cp=(curve*2,(hy+t)/2)
    N=40;L=[];Rr=[]
    for i in range(N+1):
        u=i/N
        x=(1-u)**2*p0[0]+2*(1-u)*u*cp[0]+u*u*p2[0];y=(1-u)**2*p0[1]+2*(1-u)*u*cp[1]+u*u*p2[1]
        dx=2*(1-u)*(cp[0]-p0[0])+2*u*(p2[0]-cp[0]);dy=2*(1-u)*(cp[1]-p0[1])+2*u*(p2[1]-cp[1])
        l=math.hypot(dx,dy);nx,ny=-dy/l,dx/l
        w=(lw0+(lw1-lw0)*u)/2
        L.append((x+nx*w,y+ny*w));Rr.append((x-nx*w,y-ny*w))
    f=lambda p:f"{p[0]:.2f} {p[1]:.2f}"
    d="M"+"L".join(f(p) for p in L+Rr[::-1])+"Z"
    d+=f"M{f((-r,hy))}A{r} {r} 0 1 1 {f((r,hy))}A{r} {r} 0 1 1 {f((-r,hy))}Z"
    return d

def _split(p0,c,p1,u):
    a=add(mul(p0,1-u),mul(c,u)); b=add(mul(c,1-u),mul(p1,u)); m=add(mul(a,1-u),mul(b,u))
    return (p0,a,m),(m,b,p1)
def paths3(bow=(0,0,0,0),tipcut=0.08,tipround=1.0,**k):
    """paths2 with the tip vertex softened: both flanks are cut short near the tip and rejoined by a rounded curve."""
    V,I,lines=geom(**k)
    sw=k.get('swell',(4,0,3,0))
    F=lambda p:f"{p[0]:.2f} {p[1]:.2f}"
    Q=[]
    for i in range(4):
        a,bp=V[i],V[(i+1)%4]; n=lines[i][2]
        Q.append((a,add(mul(add(a,bp),.5),mul(n,-2*bow[i])),bp))
    _,e0=_split(*Q[0],tipcut)          # T->L, drop the first bit
    e3,_=_split(*Q[3],1-tipcut)        # R->T, drop the last bit
    tipc=add(mul(V[0],tipround),mul(mul(add(e3[2],e0[0]),.5),1-tipround))
    outer="M"+F(e0[0])+"Q"+F(e0[1])+" "+F(e0[2])
    for i in (1,2): outer+="Q"+F(Q[i][1])+" "+F(Q[i][2])
    outer+="Q"+F(e3[1])+" "+F(e3[2])+"Q"+F(tipc)+" "+F(e0[0])+"Z"
    inner="M"+F(I[0])
    for i in range(4):
        a,bp=I[i],I[(i+1)%4]; n=lines[i][2]; off=2*sw[i]-2*bow[i]
        inner+=("Q"+F(add(mul(add(a,bp),.5),mul(n,off)))+" "+F(bp)) if off else "L"+F(bp)
    return outer,inner+"Z"

def paths4(bow=(0,0,0,0),ccut=0.12,cround=0.35,**k):
    """paths2 with the counter's acute tip blunted into a small rounded end,
    so no hairline slivers of background meet at the tip (they alias at small sizes)."""
    V,I,lines=geom(**k)
    sw=k.get('swell',(4,0,3,0))
    F=lambda p:f"{p[0]:.2f} {p[1]:.2f}"
    outer="M"+F(V[0])
    for i in range(4):
        a,bp=V[i],V[(i+1)%4]; n=lines[i][2]
        outer+=("Q"+F(add(mul(add(a,bp),.5),mul(n,-2*bow[i])))+" "+F(bp)) if bow[i] else "L"+F(bp)
    outer+="Z"
    Q=[]
    for i in range(4):
        a,bp=I[i],I[(i+1)%4]; n=lines[i][2]; off=2*sw[i]-2*bow[i]
        Q.append((a,add(mul(add(a,bp),.5),mul(n,off)),bp))
    _,e0=_split(*Q[0],ccut); e3,_=_split(*Q[3],1-ccut)
    tipc=add(mul(I[0],cround),mul(mul(add(e3[2],e0[0]),.5),1-cround))
    inner="M"+F(e0[0])+"Q"+F(e0[1])+" "+F(e0[2])
    for i in (1,2): inner+="Q"+F(Q[i][1])+" "+F(Q[i][2])
    inner+="Q"+F(e3[1])+" "+F(e3[2])+"Q"+F(tipc)+" "+F(e0[0])+"Z"
    return outer,inner,(add(e3[2],e0[0]))[1]/2

"""PRISMA icon v11: Didone nib. Thick/thin strokes with swells, concave flanks, sharp tip, a teardrop ball terminal on the slit."""
import math,re,sys
INK='#1B1C1E';CR='#EFEAE0'
SP=['#FF4F5E','#FF9A3C','#FFD447','#45D483','#2FB8F0','#4C6EF5','#9D5CF0']
P=dict(t=120,s=46,b=40,w=(14,3.5,10,3.5),swell=(5,0,3.5,0),hair=2,rb=9,hy=6,bow=(-3,0,0,-3),theta=50,lead=22,ccut=0.08)
outer,inner,ycut=paths4(**P)
yback=geom(**P)[1][2][1]  # inner back corner
slit=drop(**dict(P,t=ycut-0.5,b=-yback-0.5))  # slit runs counter to counter, never past the tip or the back corner
A=math.radians(45);SIZE=256
def R(x,y): return (x*math.cos(A)-y*math.sin(A), x*math.sin(A)+y*math.cos(A))
corners=[R(*p) for p in [(0,P['t']),(-P['s'],0),(0,-P['b']),(P['s'],0)]]
xs=[p[0] for p in corners];ys=[p[1] for p in corners]
k=SIZE*0.64/max(max(xs)-min(xs),max(ys)-min(ys))
ox=SIZE/2-4-k*(min(xs)+max(xs))/2;oy=SIZE/2+4-k*(min(ys)+max(ys))/2
def T(x,y): x,y=R(x,y);return (ox+k*x,oy+k*y)
f=lambda n:('%.2f'%n).rstrip('0').rstrip('.')
def bake(d):
    out=[];toks=re.findall(r'[MLQAZ]|-?[\d.]+',d);i=0
    while i<len(toks):
        c=toks[i];i+=1;out.append(c)
        if c in 'ML': x,y=T(float(toks[i]),float(toks[i+1]));i+=2;out.append(f"{f(x)} {f(y)}")
        elif c=='Q':
            a=T(float(toks[i]),float(toks[i+1]));b=T(float(toks[i+2]),float(toks[i+3]));i+=4
            out.append(f"{f(a[0])} {f(a[1])} {f(b[0])} {f(b[1])}")
        elif c=='A':
            rx,ry=float(toks[i])*k,float(toks[i+1])*k;rest=toks[i+2:i+5];x,y=T(float(toks[i+5]),float(toks[i+6]));i+=7
            out.append(f"{f(rx)} {f(ry)} {' '.join(rest)} {f(x)} {f(y)}")
    return re.sub(r'([MLQAZ]) ',r'\1',''.join(out)).replace('Z ','Z')
D_FRAME=bake(outer)+bake(inner);D_SLIT=bake(slit)
T0=T(0,P['t']);B0=T(0,-P['b'])
grad=f'<linearGradient id="spectrum" gradientUnits="userSpaceOnUse" x1="{f(T0[0])}" y1="{f(T0[1])}" x2="{f(B0[0])}" y2="{f(B0[1])}">'+''.join(f'<stop offset="{f(i/(len(SP)-1))}" stop-color="{c}"/>' for i,c in enumerate(SP))+'</linearGradient>'
def svg(fill,bg=None,defs=''):
    o=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}" role="img" aria-label="PRISMA">','  <title>PRISMA</title>']
    if defs: o.append('  <defs>'+defs+'</defs>')
    if bg: o.append(f'  <rect width="{SIZE}" height="{SIZE}" fill="{bg}"/>')
    o.append(f'  <g fill="{fill}">')
    o.append(f'    <path fill-rule="evenodd" d="{D_FRAME}"/>')
    o.append(f'    <path d="{D_SLIT}"/>')
    o.append('  </g>\n</svg>\n');return '\n'.join(o)
G='url(#spectrum)';OUT=sys.argv[1] if len(sys.argv)>1 else '.'
files={'prisma-icon-black.svg':svg(INK,CR),'prisma-icon-black-transparent.svg':svg(INK),
 'prisma-icon-white.svg':svg(CR,INK),'prisma-icon-white-transparent.svg':svg(CR),
 'prisma-icon-spectral.svg':svg(G,INK,grad),'prisma-icon-spectral-transparent.svg':svg(G,None,grad),
 'prisma-icon-spectral-light.svg':svg(G,CR,grad),'prisma-icon-spectral-light-transparent.svg':svg(G,None,grad)}
for n,c in files.items(): open(OUT+'/'+n,'w').write(c)
print(files['prisma-icon-black-transparent.svg'])
